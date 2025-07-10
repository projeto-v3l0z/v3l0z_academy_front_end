import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  IconButton,
  Input,
  Textarea,
  Checkbox,
} from "@material-tailwind/react";
import { FingerPrintIcon } from "@heroicons/react/24/solid";
import { PageTitle, Footer } from "@/widgets/layout";
import { FeatureCard, TeamCard } from "@/widgets/cards";
import { featuresData, teamData, contactData } from "@/data";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";

export function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <div className="relative flex h-screen items-center justify-center overflow-hidden bg-black px-6 pt-16 pb-32">
        {/* Fundo galáctico */}
        <div className="absolute inset-0 z-0 bg-[url('/stars-bg.jpg')] bg-cover bg-center brightness-50" />
        {/* Overlay escuro */}
        <div className="absolute inset-0 z-0 bg-black/70" />

        {/* Conteúdo principal */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-20 max-w-4xl text-center text-white"
        >
          <Typography
            variant="h1"
            className="mb-4 font-black text-4xl md:text-6xl leading-tight"
          >
            Inicie sua jornada <br />
            <span className="text-indigo-400">no universo da programação</span>
          </Typography>
          <div className="mb-8 text-lg md:text-xl text-indigo-100 font-light">
            <span className="mr-2">{">"}</span>
            <Typewriter
              words={[
                "Conectando com a base de lançamento...",
                "Preparando missão: Desenvolvedor Full Stack",
                "Destino: Planeta V3L0Z 🚀",
              ]}
              loop={0}
              cursor
              cursorStyle="_"
              typeSpeed={60}
              deleteSpeed={40}
              delaySpeed={1500}
            />
          </div>

          <Button
            size="lg"
            variant="gradient"
            color="indigo"
            className="shadow-lg shadow-indigo-600/50 transition-all hover:scale-105"
          >
            Começar sua missão
          </Button>
        </motion.div>

        {/* Astronauta flutuando */}
        <motion.img
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 2, delay: 1 }}
          src="/img/astronaut.png"
          alt="Astronauta"
          className="absolute bottom-0 right-0 w-48 md:w-72 animate-float z-1"
        />
      </div>

      {/* SECTION: FEATURES */}
      <section className="-mt-32 bg-white px-4 pb-20 pt-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map(({ color, title, icon, description }) => (
              <FeatureCard
                key={title}
                color={color}
                title={title}
                icon={React.createElement(icon, {
                  className: "w-5 h-5 text-white",
                })}
                description={description}
              />
            ))}
          </div>
          <div className="mt-32 flex flex-wrap items-center">
            <div className="mx-auto -mt-8 w-full px-4 md:w-5/12">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-gray-900 p-2 text-center shadow-lg">
                <FingerPrintIcon className="h-8 w-8 text-white " />
              </div>
              <Typography
                variant="h3"
                className="mb-3 font-bold"
                color="blue-gray"
              >
                Aprenda com os melhores
              </Typography>
              <Typography className="mb-8 font-normal text-blue-gray-500">
                Nossos cursos são ministrados por profissionais experientes do
                mercado, com foco em projetos reais e desafios do dia a dia.
              </Typography>
              <Button variant="filled">Saiba Mais</Button>
            </div>
            <div className="mx-auto mt-24 flex w-full justify-center px-4 md:w-4/12 lg:mt-0">
              <Card className="shadow-lg border shadow-gray-500/10 rounded-lg">
                <CardHeader floated={false} className="relative h-56">
                  <img
                    alt="Card Image"
                    src="https://source.unsplash.com/600x400/?technology,team"
                    className="h-full w-full object-cover"
                  />
                </CardHeader>
                <CardBody>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    Full-Stack
                  </Typography>
                  <Typography
                    variant="h5"
                    color="blue-gray"
                    className="mb-3 mt-2 font-bold"
                  >
                    Formação Completa
                  </Typography>
                  <Typography className="font-normal text-blue-gray-500">
                    Domine tecnologias frontend e backend em um só lugar e
                    desenvolva aplicações reais do zero até a produção.
                  </Typography>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: TEAM */}
      <section className="px-4 pt-20 pb-48">
        <div className="container mx-auto">
          <PageTitle section="Instrutores" heading="Conheça nossos especialistas">
            Instrutores com experiência de mercado que vão te guiar por toda a jornada rumo à sua carreira dos sonhos.
          </PageTitle>
          <div className="mt-24 grid grid-cols-1 gap-12 gap-x-24 md:grid-cols-2 xl:grid-cols-4">
            {teamData.map(({ img, name, position, socials }) => (
              <TeamCard
                key={name}
                img={img}
                name={name}
                position={position}
                socials={
                  <div className="flex items-center gap-2">
                    {socials.map(({ color, name }) => (
                      <IconButton key={name} color={color} variant="text">
                        <i className={`fa-brands text-xl fa-${name}`} />
                      </IconButton>
                    ))}
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: CONTACT */}
      <section className="relative bg-white py-24 px-4">
        <div className="container mx-auto">
          <PageTitle section="Comunidade" heading="Participe dos projetos">
            Desenvolva projetos em equipe, troque experiências com outros alunos
            e construa um portfólio sólido com apoio da comunidade.
          </PageTitle>
          <div className="mx-auto mt-20 mb-48 grid max-w-5xl grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3">
            {contactData.map(({ title, icon, description }) => (
              <Card
                key={title}
                color="transparent"
                shadow={false}
                className="text-center text-blue-gray-900"
              >
                <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-blue-gray-900 shadow-lg shadow-gray-500/20">
                  {React.createElement(icon, {
                    className: "w-5 h-5 text-white",
                  })}
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  {title}
                </Typography>
                <Typography className="font-normal text-blue-gray-500">
                  {description}
                </Typography>
              </Card>
            ))}
          </div>
          <PageTitle section="Contato" heading="Vamos conversar?">
            Preencha o formulário e entraremos em contato o mais rápido possível para apoiar sua jornada.
          </PageTitle>
          <form className="mx-auto w-full mt-12 lg:w-5/12">
            <div className="mb-8 flex gap-8">
              <Input variant="outlined" size="lg" label="Nome Completo" />
              <Input variant="outlined" size="lg" label="E-mail" />
            </div>
            <Textarea variant="outlined" size="lg" label="Mensagem" rows={8} />
            <Checkbox
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center font-normal"
                >
                  Eu concordo com os{" "}
                  <a
                    href="#"
                    className="font-medium transition-colors hover:text-gray-900"
                  >
                    Termos e Condições
                  </a>
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            />
            <Button variant="gradient" size="lg" className="mt-8" fullWidth>
              Enviar Mensagem
            </Button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <div className="bg-white">
        <Footer />
      </div>
    </>
  );
}

export default Home;
