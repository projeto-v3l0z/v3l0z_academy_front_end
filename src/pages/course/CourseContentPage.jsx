"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CourseService from "@/services/coursesService";
import StepService from "@/services/stepService";
import RenderStepContent from "@/components/course/RenderStepContent";
import {
  Typography,
  Spinner,
  Alert,
  List,
  ListItem,
  ListItemPrefix,
  Card,
  CardBody,
  Button,
} from "@material-tailwind/react";
import {
  CheckCircleIcon,
  RocketLaunchIcon,
  TrophyIcon,
} from "@heroicons/react/24/solid";

export default function CourseContentPage() {
  const { id } = useParams();
  const [steps, setSteps] = useState([]);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [finishedMessage, setFinishedMessage] = useState(false);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        const [stepsData, completedData] = await Promise.all([
          CourseService.getCourseSteps(id),
          CourseService.getCompletedSteps(id),
        ]);
        setSteps(stepsData);
        setCompletedSteps(completedData);

        if (stepsData.length > 0) {
          setCurrentStep(stepsData[0]);
        }

        if (
          completedData.length === stepsData.length &&
          stepsData.length > 0
        ) {
          setCourseCompleted(true);
        }
      } catch (err) {
        console.error("Erro ao buscar dados do curso:", err);
        setError("Erro ao carregar o curso.");
      } finally {
        setLoading(false);
      }
    }

    fetchCourseData();
  }, [id]);

  const handleSelectStep = (step) => {
    setCurrentStep(step);
    setFinishedMessage(false); // Esconde o warning se trocar manualmente de etapa
  };

  const handleNextStep = async () => {
    if (!currentStep) return;

    try {
      await StepService.completeStep(currentStep.id);

      const newCompleted = [...completedSteps, currentStep.id];
      setCompletedSteps(newCompleted);

      const currentIndex = steps.findIndex((s) => s.id === currentStep.id);

      if (currentIndex !== -1 && currentIndex + 1 < steps.length) {
        setCurrentStep(steps[currentIndex + 1]);
      } else {
        setCourseCompleted(true);
        setFinishedMessage(true); // Mostra aviso de que terminou
      }
    } catch (error) {
      console.error("Erro ao concluir etapa:", error);
      alert("Erro ao concluir etapa.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <Spinner color="red" className="h-12 w-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <Alert color="red">{error}</Alert>
      </div>
    );
  }

  const isLastStep = currentStep && steps.length > 0
    ? currentStep.id === steps[steps.length - 1].id
    : false;

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-black via-gray-900 to-black">
      {/* Sidebar */}
      <div className="w-1/4 p-6 pt-24 border-r border-gray-700 overflow-y-auto">
        <Typography variant="h4" className="text-white mb-6">
          Trilha de Missões 🚀
        </Typography>
        <List>
          {steps.map((step) => (
            <ListItem
              key={step.id}
              onClick={() => handleSelectStep(step)}
              className={`text-white font-bold transition-transform hover:scale-105 cursor-pointer ${
                currentStep?.id === step.id
                  ? "bg-red-600"
                  : "hover:bg-gray-800"
              }`}
            >
              <ListItemPrefix>
                {completedSteps.includes(step.id) ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-400" />
                ) : (
                  `${step.order}.`
                )}
              </ListItemPrefix>
              {step.title}
            </ListItem>
          ))}
        </List>

        {/* Indicativo de curso concluído */}
        {courseCompleted && (
          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-green-700 to-lime-600 text-white shadow-md flex items-center gap-3">
            <TrophyIcon className="h-6 w-6 text-yellow-300" />
            <div>
              <Typography variant="small" className="font-semibold">
                Curso Concluído! 🎉
              </Typography>
              <Typography variant="extra-small" className="opacity-80">
                Você pode revisar qualquer etapa.
              </Typography>
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo da etapa */}
      <div className="w-3/4 p-10 pt-24 flex flex-col items-center justify-start overflow-y-auto">
        {currentStep && (
          <Card className="bg-gray-800 p-8 shadow-xl w-full">
            <CardBody>
              <Typography variant="h4" className="text-white mb-4">
                {currentStep.title}
              </Typography>

              <RenderStepContent content={currentStep.content} />

              {/* Mensagem de finalização */}
              {finishedMessage && (
                <Alert color="yellow" className="mt-6">
                  🎉 Você concluiu todas as etapas deste curso! Agora você pode revisar qualquer etapa ou voltar para "Meus Cursos".
                </Alert>
              )}

              <div className="flex justify-end mt-8">
                <Button
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition-transform hover:scale-105"
                  onClick={handleNextStep}
                >
                  {isLastStep ? (
                    <>
                      Finalizar
                      <TrophyIcon className="h-5 w-5" />
                    </>
                  ) : (
                    <>
                      Próximo
                      <RocketLaunchIcon className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
