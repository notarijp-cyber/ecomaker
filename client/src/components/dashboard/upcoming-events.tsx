import React from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, ChevronRight, Users, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useLocation } from "wouter";
import { formatDate } from "@/lib/utils";
import { Event } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function UpcomingEvents() {
  const [, setLocation] = useLocation();
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });

  // Get only upcoming events (events with date > now)
  const upcomingEvents = events
    ?.filter(event => new Date(event.date) > new Date())
    ?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    ?.slice(0, 2);
    
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', { 
      day: 'numeric', 
      month: 'short'
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 border-b border-border/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <CalendarDays className="h-5 w-5 mr-2 text-primary" />
            <CardTitle className="text-xl font-heading">
              Eventi in programma
            </CardTitle>
          </div>
          
          <Button 
            variant="ghost" 
            className="text-primary hover:underline text-sm font-medium p-0 h-auto"
            onClick={() => setLocation("/events")}
          >
            Vedi tutti
          </Button>
        </div>
        <CardDescription>
          Partecipa ai nostri eventi di riciclo creativi
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 pb-2">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        ) : upcomingEvents && upcomingEvents.length > 0 ? (
          <div className="space-y-3">
            {upcomingEvents.map(event => (
              <div 
                key={event.id}
                onClick={() => setLocation(`/events?selected=${event.id}`)}
                className="rounded-lg border border-neutral-200 hover:border-neutral-300 cursor-pointer p-3 transition-all"
              >
                <div className="flex">
                  <div className="mr-3 bg-primary/10 rounded-md p-2 text-center h-14 w-14 flex flex-col justify-center flex-shrink-0">
                    <span className="text-xs text-primary font-medium uppercase">{formatEventDate(event.date).split(' ')[1]}</span>
                    <span className="text-lg font-bold text-primary">{formatEventDate(event.date).split(' ')[0]}</span>
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-medium text-sm line-clamp-1">{event.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center text-xs text-neutral-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {event.time}
                      </div>
                      {event.location && (
                        <div className="flex items-center text-xs text-neutral-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate max-w-[100px]">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <CalendarDays className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-sm font-medium mb-1">Nessun evento imminente</h3>
            <p className="text-xs text-neutral-500 mb-2">
              Nessun evento in programma al momento.
            </p>
          </div>
        )}
      </CardContent>
      
      {!isLoading && (
        <CardFooter className="pt-1 pb-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-sm"
            onClick={() => setLocation("/events")}
          >
            Visualizza calendario
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
