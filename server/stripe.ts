import Stripe from "stripe";
import { storage } from "./storage";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Structure for crowdfunding milestones
export interface CrowdfundingMilestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  completed: boolean;
}

// Stripe payment for one-time crowdfunding contribution
export async function createCrowdfundingPaymentIntent(amount: number, projectId: number, userId: number, milestoneId?: string) {
  try {
    // Create a payment intent with the amount in cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "eur",
      metadata: {
        projectId: projectId.toString(),
        userId: userId.toString(),
        type: "crowdfunding",
        milestoneId: milestoneId || "general"
      }
    });

    return { 
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    };
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    throw new Error(`Error creating payment intent: ${error.message}`);
  }
}

// Verify and process a successful Stripe payment
export async function handleSuccessfulPayment(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      throw new Error('Payment has not succeeded');
    }
    
    const { projectId, userId, type, milestoneId } = paymentIntent.metadata;
    
    if (type !== 'crowdfunding') {
      throw new Error('Invalid payment type');
    }

    // Get the amount in dollars/euros
    const amount = paymentIntent.amount / 100;
    
    // Update project funding in the database
    await updateProjectFunding(
      parseInt(projectId), 
      parseInt(userId), 
      amount, 
      milestoneId
    );
    
    return { success: true, amount, projectId, userId, milestoneId };
  } catch (error: any) {
    console.error("Error handling successful payment:", error);
    throw new Error(`Error handling payment: ${error.message}`);
  }
}

// Update the project funding information in the database
async function updateProjectFunding(projectId: number, userId: number, amount: number, milestoneId: string) {
  try {
    // Get the current project
    const project = await storage.getProject(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    
    // Verifichiamo se il progetto ha il supporto per il crowdfunding
    // Per progetti creati prima dell'aggiunta di questi campi
    if (project.isCrowdfunded === undefined) {
      // Prima aggiorniamo il progetto per aggiungere il supporto al crowdfunding
      await storage.updateProject(projectId, {
        isCrowdfunded: true
      });
    }
    
    // Update funding amount
    let currentFunding = parseFloat(project.currentFunding?.toString() || '0');
    currentFunding += amount;
    
    // Update the milestone if applicable
    let updatedMilestones = project.fundingMilestones || [];
    if (Array.isArray(updatedMilestones) && milestoneId !== 'general') {
      updatedMilestones = updatedMilestones.map((milestone: CrowdfundingMilestone) => {
        if (milestone.id === milestoneId) {
          // Mark the milestone as completed if the target has been reached
          const milestoneAmount = parseFloat(milestone.amount.toString());
          const isCompleted = currentFunding >= milestoneAmount;
          return { ...milestone, completed: isCompleted };
        }
        return milestone;
      });
    }
    
    // Update the project with new funding information
    await storage.updateProject(projectId, {
      isCrowdfunded: true,
      currentFunding: currentFunding.toString(),
      fundingMilestones: updatedMilestones
    });
    
    // Create contribution record (if your schema has a contributions table)
    // TODO: Add code to record the contribution in a dedicated table if needed
    
    return true;
  } catch (error: any) {
    console.error("Error updating project funding:", error);
    throw new Error(`Error updating funding: ${error.message}`);
  }
}

// Create an auction for a project
export async function createAuctionPaymentIntent(itemId: number, bidAmount: number, userId: number) {
  try {
    // Create a payment intent for the auction bid
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(bidAmount * 100), // Convert to cents
      currency: "eur",
      metadata: {
        itemId: itemId.toString(),
        userId: userId.toString(),
        type: "auction"
      }
    });

    return { 
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    };
  } catch (error: any) {
    console.error("Error creating auction payment intent:", error);
    throw new Error(`Error creating auction payment: ${error.message}`);
  }
}