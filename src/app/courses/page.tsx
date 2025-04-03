import { getPosts } from "@/app/utils/utils";
import { Column, Text } from "@/once-ui/components";
import { Projects } from "@/components/courses/Projects";
import { baseURL } from "@/app/resources";
import { person, courses } from "@/app/resources/content";

export async function generateMetadata() {
  const title = courses.title;
  const description = courses.description;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://${baseURL}/courses/`,
      images: [
        {
          url: ogImage,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function Courses() {
  let allProjects = getPosts(["src", "app", "courses", "projects"]);

  return (
    <Column maxWidth="m">
      <Text 
        size="l"
      >
        {courses.title}
      </Text>
    </Column>
  );
}
