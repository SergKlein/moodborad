'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, FolderPlus, ChevronRight, Home, Clock, Settings, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Временные моковые данные для проектов
const mockProjects = [
  {
    id: '1',
    name: 'Современная квартира',
    description: 'Проект дизайна однокомнатной квартиры в современном стиле',
    status: 'in-progress',
    updatedAt: '2024-04-05T14:30:00Z',
    rooms: 3,
    style: 'Современный'
  },
  {
    id: '2',
    name: 'Загородный дом',
    description: 'Дизайн загородного дома для семьи с детьми',
    status: 'completed',
    updatedAt: '2024-04-01T10:15:00Z',
    rooms: 5,
    style: 'Скандинавский'
  },
  {
    id: '3',
    name: 'Офисное пространство',
    description: 'Проект реновации офисного пространства',
    status: 'draft',
    updatedAt: '2024-04-07T08:45:00Z',
    rooms: 2,
    style: 'Минималистичный'
  }
];

type ProjectStatus = 'draft' | 'in-progress' | 'completed';

// Вспомогательная функция для форматирования даты
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

// Вспомогательная функция для определения статуса проекта
function getStatusBadge(status: ProjectStatus) {
  const statusConfig = {
    'draft': {
      label: 'Черновик',
      className: 'bg-yellow-100 text-yellow-800'
    },
    'in-progress': {
      label: 'В процессе',
      className: 'bg-blue-100 text-blue-800'
    },
    'completed': {
      label: 'Завершен',
      className: 'bg-green-100 text-green-800'
    }
  };

  const config = statusConfig[status];
  
  return (
    <span className={cn(
      'px-2 py-1 rounded-full text-xs font-medium',
      config.className
    )}>
      {config.label}
    </span>
  );
}

export default function ProjectsPage() {
  const [filter, setFilter] = useState<string>('all');
  
  const filteredProjects = filter === 'all' 
    ? mockProjects 
    : mockProjects.filter(project => project.status === filter);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Проекты</h1>
          <p className="text-muted-foreground">Управляйте своими дизайн-проектами</p>
        </div>
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-full">
          <Link href="/projects/new" className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Новый проект
          </Link>
        </Button>
      </div>

      <div className="flex space-x-2 mb-6">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setFilter('all')}
          className="rounded-full"
        >
          Все
        </Button>
        <Button 
          variant={filter === 'in-progress' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setFilter('in-progress')}
          className="rounded-full"
        >
          В процессе
        </Button>
        <Button 
          variant={filter === 'completed' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setFilter('completed')}
          className="rounded-full"
        >
          Завершенные
        </Button>
        <Button 
          variant={filter === 'draft' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setFilter('draft')}
          className="rounded-full"
        >
          Черновики
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Карточка для создания нового проекта */}
        <Card className="border border-dashed hover:border-foreground/50 bg-muted/50 transition-colors duration-300">
          <CardContent className="flex flex-col items-center justify-center h-full py-10">
            <Link href="/projects/new">
              <Button variant="ghost" className="flex flex-col h-32 w-32 rounded-full">
                <FolderPlus className="h-12 w-12 mb-2 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Создать проект</span>
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Карточки проектов */}
        {filteredProjects.map(project => (
          <Card key={project.id} className="hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                {getStatusBadge(project.status as ProjectStatus)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex items-center">
                  <Home className="h-4 w-4 text-muted-foreground mr-2" />
                  <span>{project.rooms} комнат</span>
                </div>
                <div className="flex items-center">
                  <Settings className="h-4 w-4 text-muted-foreground mr-2" />
                  <span>Стиль: {project.style}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                  <span>Обновлено: {formatDate(project.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2 border-t">
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Редактировать</span>
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0 text-destructive">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Удалить</span>
                </Button>
              </div>
              <Button variant="outline" size="sm" className="rounded-full" asChild>
                <Link href={`/projects/${project.id}`}>
                  <span>Открыть</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 