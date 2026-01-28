import React from "react";
import { useLocation } from "wouter";
import { Event } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users, CalendarRange, CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatTime, getEventDateDisplay } from "@/lib/utils";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [, setLocation] = useLocation();
  const { day, month } = getEventDateDisplay(event.date);
  
  const getEventColor = () => {
    // You can expand this logic based on event categories if needed
    return event.projectId ? "from-emerald-500 to-green-600" : "from-blue-500 to-cyan-600";
  };

  const getEventTheme = () => {
    return event.projectId ? 
      { 
        bg: "bg-emerald-500", 
        text: "text-emerald-700",
        light: "bg-emerald-50",
        border: "border-emerald-200",
        icon: "text-emerald-600" 
      } : { 
        bg: "bg-blue-500", 
        text: "text-blue-700",
        light: "bg-blue-50",
        border: "border-blue-200",
        icon: "text-blue-600"
      };
  };
  
  const theme = getEventTheme();
  
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all duration-300 border-neutral-200/70">
      <div className="flex">
        <div className={`w-24 flex-shrink-0 bg-gradient-to-br ${getEventColor()} flex flex-col items-center justify-center text-white shadow-sm`}>
          <span className="text-2xl font-bold">{day}</span>
          <span className="text-sm uppercase tracking-wide">{month}</span>
          <div className="mt-2 w-10 h-0.5 bg-white/30"></div>
          <span className="text-xs font-medium mt-1.5 uppercase tracking-wider">2023</span>
        </div>
        
        <CardContent className="p-5 flex-grow relative">
          <div className="absolute top-3 right-3">
            <Badge 
              variant="outline"
              className={`${theme.light} ${theme.text} ${theme.border} border`}
            >
              {event.projectId ? "Progetto" : "Evento"}
            </Badge>
          </div>
          
          <h3 className="font-heading font-semibold text-neutral-900 pr-16 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          
          <p className="text-neutral-600 text-sm mt-2 line-clamp-2">
            {event.description}
          </p>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-neutral-700">
              <div className={`rounded-full p-1.5 ${theme.light} mr-2`}>
                <Clock className={`h-3.5 w-3.5 ${theme.icon}`} />
              </div>
              <span className="font-medium">
                {formatTime(event.date)}
                {event.endDate && ` - ${formatTime(event.endDate)}`}
              </span>
            </div>
            
            <div className="flex items-center text-sm text-neutral-700">
              <div className={`rounded-full p-1.5 ${theme.light} mr-2`}>
                <MapPin className={`h-3.5 w-3.5 ${theme.icon}`} />
              </div>
              <span>{event.location || "Location da definire"}</span>
            </div>
            
            <div className="flex items-center text-sm text-neutral-700">
              <div className={`rounded-full p-1.5 ${theme.light} mr-2`}>
                <Users className={`h-3.5 w-3.5 ${theme.icon}`} />
              </div>
              <span>
                {event.maxParticipants ? `${event.maxParticipants} partecipanti max` : "Partecipanti illimitati"}
              </span>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-end">
            <Button 
              variant="outline"
              className={`${theme.text} border-${event.projectId ? 'emerald' : 'blue'}-200 hover:bg-${event.projectId ? 'emerald' : 'blue'}-50`}
              onClick={() => setLocation(`/events/${event.id}`)}
            >
              {event.projectId ? (
                <>
                  <CalendarCheck className="h-4 w-4 mr-1.5" />
                  Partecipa al progetto
                </>
              ) : (
                <>
                  <CalendarRange className="h-4 w-4 mr-1.5" />
                  Partecipa all'evento
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
