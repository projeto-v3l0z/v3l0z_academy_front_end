// components/course/CourseMetrics.jsx
import {
  BoltIcon,
  RocketLaunchIcon,
  UserGroupIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { Typography } from "@material-tailwind/react";

export default function CourseMetrics({ course }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center mt-8">
      <MetricItem
        icon={<BoltIcon className="h-6 w-6 text-yellow-400 mx-auto" />}
        label="Duração"
        value={`${course.workload}h`}
      />
      <MetricItem
        icon={<UserGroupIcon className="h-6 w-6 text-cyan-400 mx-auto" />}
        label="Alunos"
        value={course.enrolled_count ?? "—"}
      />
      <MetricItem
        icon={<StarIcon className="h-6 w-6 text-green-400 mx-auto" />}
        label="Avaliação"
        value={course.rating?.toFixed(1) ?? "—"}
      />
      <MetricItem
        icon={<RocketLaunchIcon className="h-6 w-6 text-purple-400 mx-auto" />}
        label="Certificado"
        value="Sim"
      />
    </div>
  );
}

function MetricItem({ icon, label, value }) {
  return (
    <div>
      {icon}
      <Typography variant="small" className="text-gray-400 mt-2">
        {label}
      </Typography>
      <Typography className="text-white font-bold">{value}</Typography>
    </div>
  );
}
