// src/pages/teacher/TeacherCoursesPage.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherCourseService from '@/services/teacherCourseService';
import {
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Switch,
} from '@material-tailwind/react';

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    workload: 0,
    price: 0,
    is_free: false,
    image: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const data = await TeacherCourseService.getMyCourses();
    setCourses(data.results || data);
    setLoading(false);
  };

  const handleOpen = () => {
    setCourseData({ title: '', description: '', workload: 0, price: 0, is_free: false, image: null });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleFileChange = (e) => {
    setCourseData({ ...courseData, image: e.target.files[0] });
  };

  const handleCreate = async () => {
    try {
      const formData = new FormData();
      formData.append('title', courseData.title);
      formData.append('description', courseData.description);
      formData.append('workload', courseData.workload);
      formData.append('price', courseData.price);
      formData.append('is_free', courseData.is_free);
      if (courseData.image) formData.append('image', courseData.image);

      const created = await TeacherCourseService.createCourse(formData);
      handleClose();
      navigate(`/teacher/courses/${created.id}/steps`);
    } catch (err) {
      console.error('Erro ao criar curso:', err);
    }
  };

  const goToEdit = (courseId) => {
    navigate(`/teacher/courses/${courseId}/steps`);
  };

  return (
    <div className="bg-black min-h-screen pt-24 p-8">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h3" className="text-white">
          Área do Professor
        </Typography>
        <Button color="blue" onClick={handleOpen}>
          Novo Curso
        </Button>
      </div>

      {loading ? (
        <Typography className="text-white">Carregando...</Typography>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => goToEdit(course.id)}
              className="bg-gray-800 p-4 rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105 cursor-pointer"
            >
              <Typography variant="h5" className="text-white">
                {course.title}
              </Typography>
              <Typography className="text-gray-300 mt-2">
                {course.description}
              </Typography>
              <div className="mt-3 flex items-center justify-between">
                <Typography variant="small" className="text-gray-400">
                  {course.is_free ? 'Gratuito' : `R$ ${parseFloat(course.price).toFixed(2)}`}
                </Typography>
                <Typography variant="small" className="text-gray-400">
                  {course.workload}h
                </Typography>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} handler={handleClose} size="lg">
        <DialogHeader>Criar Curso</DialogHeader>
        <DialogBody divider>
          <div className="space-y-4">
            <Input
              label="Título"
              value={courseData.title}
              onChange={(e) =>
                setCourseData({ ...courseData, title: e.target.value })
              }
            />
            <Input
              label="Descrição"
              value={courseData.description}
              onChange={(e) =>
                setCourseData({ ...courseData, description: e.target.value })
              }
            />
            <Input
              type="text"
              label="Carga Horária (h)"
              value={courseData.workload}
              onChange={(e) =>
                setCourseData({ ...courseData, workload: +e.target.value })
              }
              placeholder="0"
            />
            <div className="flex items-center gap-3">
              <Switch
                id="free-switch"
                checked={courseData.is_free}
                onChange={(e) =>
                  setCourseData({ ...courseData, is_free: e.target.checked })
                }
              />
              <label htmlFor="free-switch" className="text-white">
                Gratuito
              </label>
            </div>
            {!courseData.is_free && (
              <Input
                type="text"
                label="Preço"
                value={courseData.price}
                onChange={(e) =>
                  setCourseData({ ...courseData, price: parseFloat(e.target.value) || 0 })
                }
                placeholder="0.00"
              />
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-white"
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={handleClose}>
            Cancelar
          </Button>
          <Button color="green" onClick={handleCreate}>
            Salvar Curso
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
