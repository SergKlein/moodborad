'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ArrowRight, Check, HomeIcon, Palette, Workflow, BedDouble, Sofa, ChefHat, Droplets } from 'lucide-react';

// Определение шагов мастера
const STEPS = [
  { id: 'basic', title: 'Basic Information' },
  { id: 'style', title: 'Style Preferences' },
  { id: 'rooms', title: 'Rooms' },
  { id: 'additional', title: 'Additional Details' },
  { id: 'summary', title: 'Confirmation' },
];

// Стили дизайна для выбора
const DESIGN_STYLES = [
  { id: 'modern', name: 'Modern', icon: <Palette /> },
  { id: 'scandinavian', name: 'Scandinavian', icon: <Droplets /> },
  { id: 'minimalist', name: 'Minimalist', icon: <HomeIcon /> },
  { id: 'industrial', name: 'Industrial', icon: <Workflow /> },
  { id: 'traditional', name: 'Traditional', icon: <Sofa /> },
];

// Типы комнат для выбора
const ROOM_TYPES = [
  { id: 'living', name: 'Living Room', icon: <Sofa /> },
  { id: 'bedroom', name: 'Bedroom', icon: <BedDouble /> },
  { id: 'kitchen', name: 'Kitchen', icon: <ChefHat /> },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'private',
    designStyle: '',
    colorPreferences: [],
    rooms: [] as string[],
    budget: '',
    timeline: '',
    notes: '',
  });

  // Обработчик изменения полей формы
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Обработчики выбора комнат
  const handleRoomToggle = (roomId: string) => {
    setFormData(prev => {
      const rooms = [...prev.rooms];
      if (rooms.includes(roomId)) {
        return { ...prev, rooms: rooms.filter(id => id !== roomId) };
      } else {
        return { ...prev, rooms: [...rooms, roomId] };
      }
    });
  };

  // Функция для отображения индикатора прогресса
  const ProgressIndicator = () => (
    <div className="flex justify-between mb-8">
      {STEPS.map((step, index) => (
        <div 
          key={step.id} 
          className="flex flex-col items-center"
        >
          <div 
            className={`
              flex items-center justify-center w-8 h-8 rounded-full mb-2
              ${index < currentStep 
                ? 'bg-yellow-400 text-black' 
                : index === currentStep 
                  ? 'bg-black text-white' 
                  : 'bg-gray-200 text-gray-500'}
            `}
          >
            {index < currentStep ? (
              <Check className="w-4 h-4" />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
          <span className={`
            text-xs font-medium 
            ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}
          `}>
            {step.title}
          </span>
          {index < STEPS.length - 1 && (
            <div className="hidden sm:block absolute left-0 right-0 h-0.5 bg-gray-200 top-4 z-[-1]" />
          )}
        </div>
      ))}
    </div>
  );

  // Навигация между шагами
  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Обработчик отправки формы
  const handleSubmit = () => {
    // В реальном приложении здесь будет вызов API для создания проекта
    console.log('Creating project:', formData);
    router.push('/projects');
  };

  // Рендеринг соответствующего шага мастера
  const renderStep = () => {
    switch (currentStep) {
      case 0: // Основная информация
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Project Name</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => handleChange('name', e.target.value)} 
                placeholder="Enter project name"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea 
                id="description" 
                value={formData.description} 
                onChange={(e) => handleChange('description', e.target.value)} 
                placeholder="Brief project description" 
                className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                rows={3}
              />
            </div>
            <div>
              <Label>Project Visibility</Label>
              <RadioGroup 
                value={formData.visibility} 
                onValueChange={(value) => handleChange('visibility', value)}
                className="flex space-x-4 mt-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private">Private</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public">Public</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );
      case 1: // Стиль и предпочтения
        return (
          <div className="space-y-4">
            <Label>Select main design style</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DESIGN_STYLES.map(style => (
                <Card 
                  key={style.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    formData.designStyle === style.id ? 'border-2 border-yellow-400' : ''
                  }`}
                  onClick={() => handleChange('designStyle', style.id)}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className="w-12 h-12 flex items-center justify-center mb-2">
                      {style.icon}
                    </div>
                    <span className="font-medium">{style.name}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4">
              <Label htmlFor="colorPreferences">Color Preferences</Label>
              <textarea 
                id="colorPreferences" 
                value={formData.colorPreferences} 
                onChange={(e) => handleChange('colorPreferences', e.target.value)} 
                placeholder="Describe preferred colors (e.g., pastel tones, natural colors, etc.)" 
                className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                rows={3}
              />
            </div>
          </div>
        );
      case 2: // Комнаты
        return (
          <div className="space-y-4">
            <Label>Select rooms for your project</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ROOM_TYPES.map(room => (
                <Card 
                  key={room.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    formData.rooms.includes(room.id) ? 'border-2 border-yellow-400' : ''
                  }`}
                  onClick={() => handleRoomToggle(room.id)}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className="w-12 h-12 flex items-center justify-center mb-2">
                      {room.icon}
                    </div>
                    <span className="font-medium">{room.name}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case 3: // Дополнительно
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="budget">Budget (optional)</Label>
              <Input 
                id="budget" 
                value={formData.budget} 
                onChange={(e) => handleChange('budget', e.target.value)} 
                placeholder="Estimated budget"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="timeline">Timeline (optional)</Label>
              <Input 
                id="timeline" 
                value={formData.timeline} 
                onChange={(e) => handleChange('timeline', e.target.value)} 
                placeholder="Expected completion timeline"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="notes">Additional Requirements</Label>
              <textarea 
                id="notes" 
                value={formData.notes} 
                onChange={(e) => handleChange('notes', e.target.value)} 
                placeholder="Any additional requirements or preferences" 
                className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                rows={4}
              />
            </div>
          </div>
        );
      case 4: // Подтверждение
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="font-medium">Name:</span> {formData.name}
                </div>
                <div>
                  <span className="font-medium">Description:</span> {formData.description}
                </div>
                <div>
                  <span className="font-medium">Visibility:</span> {formData.visibility === 'private' ? 'Private' : 'Public'}
                </div>
                <div>
                  <span className="font-medium">Design Style:</span> {
                    DESIGN_STYLES.find(style => style.id === formData.designStyle)?.name || 'Not selected'
                  }
                </div>
                <div>
                  <span className="font-medium">Rooms:</span> {
                    formData.rooms.length > 0 
                      ? formData.rooms.map(roomId => 
                          ROOM_TYPES.find(room => room.id === roomId)?.name
                        ).join(', ')
                      : 'Not selected'
                  }
                </div>
                {formData.budget && (
                  <div>
                    <span className="font-medium">Budget:</span> {formData.budget}
                  </div>
                )}
                {formData.timeline && (
                  <div>
                    <span className="font-medium">Timeline:</span> {formData.timeline}
                  </div>
                )}
                {formData.notes && (
                  <div>
                    <span className="font-medium">Additional Requirements:</span> {formData.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  // Определение названия кнопки для текущего шага
  const getNextButtonText = () => {
    if (currentStep === STEPS.length - 1) {
      return 'Create Project';
    }
    return 'Next';
  };

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Create New Project</h1>
        <p className="text-muted-foreground">Fill in the information about your project</p>
      </div>

      <div className="relative">
        <ProgressIndicator />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{STEPS[currentStep].title}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep} 
            disabled={currentStep === 0}
            className="rounded-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button 
            onClick={nextStep}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-full"
            disabled={currentStep === 0 && !formData.name}
          >
            {getNextButtonText()}
            {currentStep < STEPS.length - 1 && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-4 text-center">
        <Button variant="link" asChild>
          <Link href="/projects">Cancel and return to projects</Link>
        </Button>
      </div>
    </div>
  );
} 