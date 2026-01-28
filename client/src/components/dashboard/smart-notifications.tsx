import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, BellRing, CheckCircle, Clock, Lightbulb, Recycle, Users, Calendar, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'suggestion' | 'event' | 'achievement';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  priority: 'low' | 'medium' | 'high';
  category: 'project' | 'material' | 'event' | 'achievement' | 'system';
}

interface SmartNotificationsProps {
  userId: number;
}

export function SmartNotifications({ userId }: SmartNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showAll, setShowAll] = useState(false);

  const { data: projects } = useQuery({ queryKey: ['/api/projects'] });
  const { data: materials } = useQuery({ queryKey: ['/api/materials'] });
  const { data: events } = useQuery({ queryKey: ['/api/events'] });
  const { data: impact } = useQuery({ queryKey: ['/api/environmental-impact', userId] });

  // Generate smart notifications based on user data and patterns
  useEffect(() => {
    if (!projects || !materials || !events || !impact) return;

    const generateNotifications = (): Notification[] => {
      const notifications: Notification[] = [];
      const now = new Date();

      // Material availability notifications
      const availableMaterials = materials.filter((m: any) => m.isAvailable && m.quantity > 0);
      if (availableMaterials.length > 5) {
        notifications.push({
          id: 'materials-available',
          title: 'Nuovi materiali disponibili',
          message: `${availableMaterials.length} materiali sono ora disponibili nella tua zona. Perfetti per nuovi progetti!`,
          type: 'suggestion',
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
          read: false,
          actionUrl: '/inventory',
          actionText: 'Vedi materiali',
          priority: 'medium',
          category: 'material'
        });
      }

      // Project completion suggestions
      const userProjects = projects.filter((p: any) => p.userId === userId && p.completionPercentage < 100);
      if (userProjects.length > 0) {
        const oldestProject = userProjects[0];
        notifications.push({
          id: 'project-reminder',
          title: 'Completa il tuo progetto',
          message: `Il progetto "${oldestProject.name}" è ancora in corso. Che ne dici di finirlo oggi?`,
          type: 'info',
          timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000),
          read: false,
          actionUrl: `/project/${oldestProject.id}`,
          actionText: 'Continua progetto',
          priority: 'medium',
          category: 'project'
        });
      }

      // Achievement notifications
      if (impact.materialsRecycled >= 25) {
        notifications.push({
          id: 'achievement-eco-warrior',
          title: 'Traguardo raggiunto! 🏆',
          message: 'Hai sbloccato il badge "Eco Warrior" riciclando oltre 25kg di materiali!',
          type: 'achievement',
          timestamp: new Date(now.getTime() - 30 * 60 * 1000),
          read: false,
          priority: 'high',
          category: 'achievement'
        });
      }

      // Upcoming events
      const upcomingEvents = events.filter((e: any) => {
        const eventDate = new Date(e.date);
        const daysDiff = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff > 0 && daysDiff <= 3;
      });

      upcomingEvents.forEach((event: any) => {
        notifications.push({
          id: `event-${event.id}`,
          title: 'Evento in arrivo',
          message: `"${event.title}" inizia tra ${Math.ceil((new Date(event.date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} giorni.`,
          type: 'event',
          timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000),
          read: false,
          actionUrl: '/events',
          actionText: 'Partecipa',
          priority: 'medium',
          category: 'event'
        });
      });

      // Smart project suggestions based on available materials
      const plasticMaterials = materials.filter((m: any) => 
        m.name.toLowerCase().includes('plastica') && m.isAvailable
      );
      if (plasticMaterials.length >= 3) {
        notifications.push({
          id: 'suggestion-plastic-project',
          title: 'Idea progetto intelligente',
          message: 'Hai molti materiali plastici disponibili. Che ne dici di creare un organizer per la scrivania?',
          type: 'suggestion',
          timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000),
          read: false,
          actionUrl: '/create-project',
          actionText: 'Crea progetto',
          priority: 'low',
          category: 'project'
        });
      }

      // Weekly impact summary
      notifications.push({
        id: 'weekly-summary',
        title: 'Riepilogo settimanale',
        message: `Questa settimana hai riciclato ${Math.round(impact.materialsRecycled * 0.15)}kg di materiali e risparmiato €${Math.round(impact.moneySaved * 0.15)}!`,
        type: 'info',
        timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000),
        read: false,
        priority: 'low',
        category: 'system'
      });

      // Community project opportunities
      const communityProjects = projects.filter((p: any) => p.isCommunityProject);
      if (communityProjects.length > 0) {
        notifications.push({
          id: 'community-opportunity',
          title: 'Unisciti alla comunità',
          message: `Ci sono ${communityProjects.length} progetti di comunità che potrebbero interessarti. Collabora con altri eco-makers!`,
          type: 'suggestion',
          timestamp: new Date(now.getTime() - 16 * 60 * 60 * 1000),
          read: false,
          actionUrl: '/community',
          actionText: 'Esplora progetti',
          priority: 'medium',
          category: 'project'
        });
      }

      return notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    };

    setNotifications(generateNotifications());
  }, [projects, materials, events, impact, userId]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'achievement': return CheckCircle;
      case 'suggestion': return Lightbulb;
      case 'event': return Calendar;
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      default: return Bell;
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'achievement': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suggestion': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'event': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'warning': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            <CardTitle>Notifiche Intelligenti</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Segna tutte come lette
            </Button>
          )}
        </div>
        <CardDescription>
          Suggerimenti personalizzati e aggiornamenti basati sulla tua attività
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayedNotifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nessuna notifica al momento</p>
            <p className="text-sm">Torneremo presto con suggerimenti personalizzati!</p>
          </div>
        ) : (
          <>
            {displayedNotifications.map((notification) => {
              const Icon = getIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-lg border transition-all hover:shadow-sm",
                    notification.read ? "bg-gray-50 border-gray-200" : "bg-white border-l-4 border-l-blue-500"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-full flex-shrink-0",
                    getTypeColor(notification.type)
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={cn(
                        "text-sm font-medium",
                        notification.read ? "text-gray-600" : "text-gray-900"
                      )}>
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {notification.priority}
                        </Badge>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                    </div>
                    
                    <p className={cn(
                      "text-sm mb-2",
                      notification.read ? "text-gray-500" : "text-gray-700"
                    )}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {new Intl.RelativeTimeFormat('it', { numeric: 'auto' }).format(
                          Math.round((notification.timestamp.getTime() - Date.now()) / (1000 * 60 * 60)),
                          'hour'
                        )}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        {notification.actionUrl && (
                          <Button variant="outline" size="sm" className="text-xs">
                            {notification.actionText}
                          </Button>
                        )}
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {notifications.length > 5 && (
              <div className="text-center pt-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowAll(!showAll)}
                  className="text-sm"
                >
                  {showAll ? 'Mostra meno' : `Mostra altre ${notifications.length - 5} notifiche`}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}