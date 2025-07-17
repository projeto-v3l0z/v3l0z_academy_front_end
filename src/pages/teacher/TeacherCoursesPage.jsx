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
  Spinner,
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
    <div className="relative min-h-screen bg-black text-white z-0">
      {/* Background Galáctico */}
      <video
        src="/space-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 space-y-16">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <Typography
            variant="h2"
            className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 font-extrabold text-4xl"
          >
            Painel do Instrutor
          </Typography>
          <Button color="purple" onClick={handleOpen}>
            Criar novo curso
          </Button>
        </div>

        {/* Lista de Cursos */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Spinner color="purple" className="h-12 w-12" />
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => goToEdit(course.id)}
              className="relative bg-white/5 border border-indigo-400/20 rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:scale-[1.03] transition-transform duration-300"
            >
              {/* Imagem */}
              <div className="h-40 bg-black overflow-hidden">
                <img
                  src={course.image || "https://placehold.co/600x400?text=Curso"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Conteúdo */}
              <div className="p-5 space-y-2">
                <Typography
                  variant="h6"
                  className="text-white font-bold line-clamp-2"
                >
                  {course.title}
                </Typography>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{course.workload}h</span>
                  <span>
                    {course.is_free
                      ? "Gratuito"
                      : `R$ ${parseFloat(course.price).toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* Badge no canto */}
              <div className="absolute top-2 left-2 bg-black/60 text-xs text-white px-2 py-1 rounded shadow border border-white/10">
                {course.is_free ? "FREE" : "PREMIUM"}
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Modal de Novo Curso */}
      <Dialog open={open} handler={handleClose} size="lg">
        <DialogHeader className="text-white">Criar Novo Curso</DialogHeader>
        <DialogBody divider className="bg-black text-white">
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Título"
              value={courseData.title}
              onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
              className="text-white"
            />
            <Input
              label="Descrição"
              value={courseData.description}
              onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
            />
            <Input
              type="number"
              label="Carga Horária (h)"
              value={courseData.workload}
              onChange={(e) => setCourseData({ ...courseData, workload: +e.target.value })}
            />
            <div className="flex items-center gap-4">
              <Switch
                id="free-switch"
                checked={courseData.is_free}
                onChange={(e) => setCourseData({ ...courseData, is_free: e.target.checked })}
              />
              <label htmlFor="free-switch" className="text-white">
                Gratuito
              </label>
            </div>
            {!courseData.is_free && (
              <Input
                type="number"
                label="Preço (R$)"
                value={courseData.price}
                onChange={(e) => setCourseData({ ...courseData, price: parseFloat(e.target.value) || 0 })}
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
        <DialogFooter className="bg-black text-white">
          <Button variant="text" onClick={handleClose} color="white">
            Cancelar
          </Button>
          <Button onClick={handleCreate} color="green">
            Salvar
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
