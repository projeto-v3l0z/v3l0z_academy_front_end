import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TeacherCourseService from '@/services/teacherCourseService';
import StepFormBuilder from '@/components/course/StepFormBuilder';
import {
  Typography,
  Button,
  Spinner,
  Alert,
  Card,
  CardBody,
} from '@material-tailwind/react';

export default function TeacherCourseStepsPage() {
  const { id } = useParams(); // course ID
  const navigate = useNavigate();

  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // carrega etapas existentes
  useEffect(() => {
    async function fetchSteps() {
      setLoading(true);
      try {
        const raw = await TeacherCourseService.getSteps(id);
        // raw é array de StepSerializer
        // transforma para o formato que o StepFormBuilder espera
        const formatted = raw.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          order: s.order,
          content: s.content, // assume já no formato { blocks: [...] }
        }));
        setSteps(formatted);
      } catch (err) {
        console.error('Erro ao buscar etapas:', err);
        setError('Não foi possível carregar as etapas.');
      } finally {
        setLoading(false);
      }
    }
    fetchSteps();
  }, [id]);

  const handleSaveSteps = async () => {
    setLoading(true);
    try {
      // para cada etapa, cria ou atualiza conforme exista id
      for (const step of steps) {
        const payload = {
          title: step.title,
          description: step.description,
          order: step.order,
          content: step.content,
        };
        if (step.id) {
          await TeacherCourseService.updateStep(step.id, payload);
        } else {
          await TeacherCourseService.createStep(id, payload);
        }
      }
      navigate('/teacher');
    } catch (err) {
      console.error('Erro ao salvar etapas:', err);
      setError('Erro ao salvar etapas.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <Spinner color="red" className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pt-24 p-8">
      <Typography variant="h4" className="text-white mb-6">
        Editar Etapas do Curso #{id}
      </Typography>

      {error && <Alert color="red" className="mb-4">{error}</Alert>}

      <Card className="bg-gray-800 mb-6">
        <CardBody>
          <StepFormBuilder steps={steps} setSteps={setSteps} />
        </CardBody>
      </Card>

      <div className="flex justify-end">
        <Button color="green" onClick={handleSaveSteps} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Etapas'}
        </Button>
      </div>
    </div>
  );
}


