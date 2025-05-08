import React, { useState } from 'react';
import {
  Input,
  Textarea,
  Select,
  Option,
  Button,
  Typography,
  Checkbox,
  Card,
  CardBody,
  Radio,
  RadioGroup,
} from '@material-tailwind/react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';

function extractYouTubeId(input) {
  const url = input.trim();
  const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?\/]+)/;
  const match = url.match(regex);
  return match && match[1] ? match[1] : url;
}

export default function StepFormBuilder({ steps = [], setSteps }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const total = steps.length;
  const current = steps[currentIdx] || { title: '', description: '', content: { blocks: [] } };

  const blockTypes = [
    'heading','text','video','image','code','checklist',
    'alert','embed','audio','table','accordion','timeline','quiz'
  ];
  const [newBlockType, setNewBlockType] = useState(blockTypes[0]);

  // Navegação de etapas
  const goPrev = () => setCurrentIdx(i => Math.max(i - 1, 0));
  const goNext = () => setCurrentIdx(i => Math.min(i + 1, total - 1));

  // CRUD de etapas
  const addStep = () => {
    const order = steps.length + 1;
    setSteps([...steps, { id: null, title: '', description: '', order, content: { blocks: [] } }]);
    setCurrentIdx(steps.length);
  };
  const removeStep = () => {
    if (total <= 1) return;
    const filtered = steps.filter((_, i) => i !== currentIdx);
    setSteps(filtered.map((s, i) => ({ ...s, order: i + 1 })));
    setCurrentIdx(i => Math.max(i - 1, 0));
  };

  // Atualiza título/descrição
  const updateStepField = (field, value) => {
    setSteps(steps.map((s, i) => i === currentIdx ? { ...s, [field]: value } : s));
  };

  // Movimenta/remover blocos
  const moveBlock = (idx, dir) => {
    const updated = [...steps];
    const blocks = updated[currentIdx].content.blocks;
    const t = idx + dir;
    if (t < 0 || t >= blocks.length) return;
    [blocks[idx], blocks[t]] = [blocks[t], blocks[idx]];
    setSteps(updated);
  };
  const removeBlock = i => {
    const updated = [...steps];
    updated[currentIdx].content.blocks.splice(i, 1);
    setSteps(updated);
  };

  // Cria bloco com valores padrões
  const addBlock = type => {
    const updated = [...steps];
    const blocks = updated[currentIdx].content.blocks || [];
    let blk = { id: null, type, data: {} };
    switch(type) {
      case 'heading': blk.data = { level: 2, text: '' }; break;
      case 'text': blk.data = { text: '' }; break;
      case 'video': blk.data = { provider: 'youtube', videoId: '' }; break;
      case 'image': blk.data = { src: '', alt: '' }; break;
      case 'code': blk.data = { language: 'javascript', code: '' }; break;
      case 'checklist': blk.data = { items: [] }; break;
      case 'alert': blk.data = { style: 'info', text: '' }; break;
      case 'embed': blk.data = { src: '', height: 400 }; break;
      case 'audio': blk.data = { src: '' }; break;
      case 'table': blk.data = { headers: [''], rows: [['']] }; break;
      case 'accordion': blk.data = { items: [{ title: '', content: '' }] }; break;
      case 'timeline': blk.data = { events: [{ date: '', text: '' }] }; break;
      case 'quiz': blk.data = { questions: [{ question: '', options: [''], answerIndex: 0 }] }; break;
      default: break;
    }
    blocks.push(blk);
    updated[currentIdx].content.blocks = blocks;
    setSteps(updated);
  };

  const updateBlockData = (bIdx, key, value) => {
    const updated = [...steps];
    updated[currentIdx].content.blocks[bIdx].data[key] = value;
    setSteps(updated);
  };

  return (
    <Card className="bg-black text-white p-6 rounded-2xl shadow-2xl">
      <CardBody className="space-y-6">

        {/* Etapas (navegação com barra de progresso e círculos) */}
        <div className="w-full mb-6">
        <div className="relative flex justify-between items-center w-full overflow-hidden">
            {/* Linha de fundo */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-700 transform -translate-y-1/2 z-0 rounded-full" />

            {steps.map((_, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center flex-1 text-center">
                {/* Círculo da etapa */}
                <div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm
                    ${i === currentIdx
                    ? 'bg-red-600 text-white scale-110 shadow-md'
                    : 'bg-gray-700 text-gray-300'}
                    transition-all duration-300`}
                >
                {i + 1}
                </div>

                {/* Título opcional abaixo do número */}
                <Typography variant="small" className="mt-1 text-xs text-gray-400 truncate max-w-[80px]">
                {steps[i]?.title || `Etapa ${i + 1}`}
                </Typography>
            </div>
            ))}
        </div>
        </div>


        {/* Cabeçalho da etapa */}
        <Typography variant="h6">Etapa {currentIdx + 1} de {total}</Typography>
        <Input
          labelProps={{ className: 'text-white' }}
          label="Título"
          value={current.title}
          onChange={e => updateStepField('title', e.target.value)}
        />
        <Textarea
          labelProps={{ className: 'text-white' }}
          label="Descrição"
          value={current.description}
          onChange={e => updateStepField('description', e.target.value)}
        />

        {/* Seletor de tipo de bloco */}
        <div className="flex items-center gap-4 mb-6">
          <Select
            labelProps={{ className: 'text-white' }}
            value={newBlockType}
            onChange={setNewBlockType}
            className="bg-black text-white"
          >
            {blockTypes.map(t => (
              <Option key={t} value={t} className="text-black capitalize">
                {t}
              </Option>
            ))}
          </Select>
          <Button
            color="green"
            className="text-white"
            onClick={() => addBlock(newBlockType)}
          >
            Adicionar Bloco
          </Button>
        </div>

        {/* Lista de blocos */}
        <div className="space-y-6">
          {current.content.blocks.map((blk, bIdx) => {
            const d = blk.data;
            return (
              <Card key={bIdx} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <CardBody className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-600 pb-2">
                    <Typography className="capitalize font-semibold text-red-400">
                      {blk.type}
                    </Typography>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="text"
                            size="sm"
                            color="white"
                            ripple={false}
                            className="p-2"
                            onClick={() => moveBlock(bIdx, -1)}
                        >
                            <ChevronUpIcon className="h-5 w-5 text-white" />
                        </Button>

                        <Button
                            variant="text"
                            size="sm"
                            color="white"
                            ripple={false}
                            className="p-2"
                            onClick={() => moveBlock(bIdx, +1)}
                        >
                            <ChevronDownIcon className="h-5 w-5 text-white" />
                        </Button>

                        <Button
                            variant="text"
                            size="sm"
                            color="red"
                            ripple={false}
                            className="p-2"
                            onClick={() => removeBlock(bIdx)}
                        >
                            <TrashIcon className="h-5 w-5 text-white" />
                        </Button>
                    </div>
                  </div>

                  {/* Inputs por tipo */}
                  {blk.type === 'heading' && (
                    <>
                      <Input
                        labelProps={{ className: 'text-white' }}
                        label="Nível (1-6)"
                        type="number"
                        value={d.level}
                        onChange={e => updateBlockData(bIdx, 'level', +e.target.value || 1)}
                      />
                      <Textarea
                        labelProps={{ className: 'text-white' }}
                        label="Texto"
                        value={d.text}
                        onChange={e => updateBlockData(bIdx, 'text', e.target.value)}
                      />
                    </>
                  )}
                  {blk.type === 'text' && (
                    <Textarea
                      labelProps={{ className: 'text-white' }}
                      label="Texto"
                      value={d.text}
                      onChange={e => updateBlockData(bIdx, 'text', e.target.value)}
                    />
                  )}
                  {blk.type === 'video' && (
                    <Input
                      labelProps={{ className: 'text-white' }}
                      label="YouTube URL/ID"
                      value={d.videoId}
                      onChange={e => updateBlockData(bIdx, 'videoId', extractYouTubeId(e.target.value))}
                    />
                  )}
                  {blk.type === 'image' && (
                    <>
                      <Input
                        labelProps={{ className: 'text-white' }}
                        label="URL da Imagem"
                        value={d.src}
                        onChange={e => updateBlockData(bIdx, 'src', e.target.value)}
                      />
                      <Input
                        labelProps={{ className: 'text-white' }}
                        label="Alt text"
                        value={d.alt}
                        onChange={e => updateBlockData(bIdx, 'alt', e.target.value)}
                      />
                    </>
                  )}
                  {blk.type === 'code' && (
                    <>
                      <Input
                        labelProps={{ className: 'text-white' }}
                        label="Linguagem"
                        value={d.language}
                        onChange={e => updateBlockData(bIdx, 'language', e.target.value)}
                      />
                      <Textarea
                        labelProps={{ className: 'text-white' }}
                        label="Código"
                        value={d.code}
                        onChange={e => updateBlockData(bIdx, 'code', e.target.value)}
                      />
                    </>
                  )}
                  {blk.type === 'checklist' && (
                    <div className="space-y-2">
                      {d.items.map((it, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Checkbox
                            labelProps={{ className: 'text-white' }}
                            checked={it.checked}
                            onChange={e => {
                              const arr = [...d.items];
                              arr[i].checked = e.target.checked;
                              updateBlockData(bIdx, 'items', arr);
                            }}
                          />
                          <Input
                            labelProps={{ className: 'text-white' }}
                            value={it.text}
                            onChange={e => {
                              const arr = [...d.items];
                              arr[i].text = e.target.value;
                              updateBlockData(bIdx, 'items', arr);
                            }}
                          />
                          <Button size="sm" color="red" variant="text" onClick={() => {
                            const arr = d.items.filter((_, idx) => idx !== i);
                            updateBlockData(bIdx, 'items', arr);
                          }}>
                            Remover
                          </Button>
                        </div>
                      ))}
                      <Button size="sm" color="green" onClick={() => {
                        updateBlockData(bIdx, 'items', [...d.items, { text: '', checked: false }]);
                      }}>
                        Adicionar Item
                      </Button>
                    </div>
                  )}
                  {blk.type === 'alert' && (
                    <>
                      <Select
                        labelProps={{ className: 'text-white' }}
                        value={d.style}
                        onChange={val => updateBlockData(bIdx, 'style', val)}
                      >
                        <Option value="info" className="text-white">Info</Option>
                        <Option value="success" className="text-white">Success</Option>
                        <Option value="warning" className="text-white">Warning</Option>
                        <Option value="danger" className="text-white">Danger</Option>
                      </Select>
                      <Textarea
                        labelProps={{ className: 'text-white' }}
                        label="Texto"
                        value={d.text}
                        onChange={e => updateBlockData(bIdx, 'text', e.target.value)}
                      />
                    </>
                  )}
                  {blk.type === 'embed' && (
                    <>
                      <Input
                        labelProps={{ className: 'text-white' }}
                        label="SRC Embed"
                        value={d.src}
                        onChange={e => updateBlockData(bIdx, 'src', e.target.value)}
                      />
                      <Input
                        labelProps={{ className: 'text-white' }}
                        type="number"
                        label="Altura"
                        value={d.height}
                        onChange={e => updateBlockData(bIdx, 'height', +e.target.value || 0)}
                      />
                    </>
                  )}
                  {blk.type === 'audio' && (
                    <Input
                      labelProps={{ className: 'text-white' }}
                      label="URL Áudio"
                      value={d.src}
                      onChange={e => updateBlockData(bIdx, 'src', e.target.value)}
                    />
                  )}
                  {/* Structured UIs */}
                  {blk.type === 'table' && (
                    <>
                      <Typography className="text-white font-semibold">Cabeçalhos</Typography>
                      {d.headers.map((h,i) => (
                        <Input
                          key={i}
                          labelProps={{ className: 'text-white' }}
                          label={`Coluna ${i+1}`}
                          value={h}
                          onChange={e => {
                            const arr = [...d.headers]; arr[i] = e.target.value;
                            updateBlockData(bIdx, 'headers', arr);
                          }}
                        />
                      ))}
                      <Button size="sm" color="green" onClick={() => updateBlockData(bIdx, 'headers', [...d.headers, ''])}>
                        Adicionar Coluna
                      </Button>

                      <Typography className="text-white font-semibold mt-4">Linhas</Typography>
                      {d.rows.map((row, ridx) => (
                        <div key={ridx} className="space-y-2"> 
                          {row.map((cell, cidx) => (
                            <Input
                              key={cidx}
                              labelProps={{ className: 'text-white' }}
                              label={`Linha ${ridx+1} - Col ${cidx+1}`}
                              value={cell}
                              onChange={e => {
                                const rr = d.rows.map(r => [...r]);
                                rr[ridx][cidx] = e.target.value;
                                updateBlockData(bIdx, 'rows', rr);
                              }}
                            />
                          ))}
                          <div className="flex gap-2">
                            <Button size="sm" color="green" onClick={() => {
                              const rr = d.rows.map(r => [...r]);
                              rr[ridx].push('');
                              updateBlockData(bIdx, 'rows', rr);
                            }}>+ Célula</Button>
                            <Button size="sm" color="red" onClick={() => {
                              const rr = d.rows.filter((_, i) => i !== ridx);
                              updateBlockData(bIdx, 'rows', rr);
                            }}>Remover Linha</Button>
                          </div>
                        </div>
                      ))}
                      <Button size="sm" color="green" onClick={() => updateBlockData(bIdx, 'rows', [...d.rows, ['']])}>
                        Adicionar Linha
                      </Button>
                    </>
                  )}
                  {blk.type === 'accordion' && (
                    <>
                      {d.items.map((it,i) => (
                        <div key={i} className="space-y-2">
                          <Input
                            labelProps={{ className: 'text-white' }}
                            label="Título"
                            value={it.title}
                            onChange={e => {
                              const arr = [...d.items]; arr[i].title = e.target.value;
                              updateBlockData(bIdx, 'items', arr);
                            }}
                          />
                          <Textarea
                            labelProps={{ className: 'text-white' }}
                            label="Conteúdo"
                            value={it.content}
                            onChange={e => {
                              const arr = [...d.items]; arr[i].content = e.target.value;
                              updateBlockData(bIdx, 'items', arr);
                            }}
                          />
                          <Button size="sm" color="red" onClick={() => {
                            const arr = d.items.filter((_, idx) => idx !== i);
                            updateBlockData(bIdx, 'items', arr);
                          }}>Remover</Button>
                        </div>
                      ))}
                      <Button size="sm" color="green" onClick={() => updateBlockData(bIdx, 'items', [...d.items, { title:'', content:'' }])}>
                        Adicionar Item
                      </Button>
                    </>
                  )}
                  {blk.type === 'timeline' && (
                    <>
                      {d.events.map((ev,i) => (
                        <div key={i} className="space-y-2">
                          <Input
                            labelProps={{ className: 'text-white' }}
                            label="Data"
                            value={ev.date}
                            onChange={e => {
                              const arr = [...d.events]; arr[i].date = e.target.value;
                              updateBlockData(bIdx, 'events', arr);
                            }}
                          />
                          <Textarea
                            labelProps={{ className: 'text-white' }}
                            label="Texto"
                            value={ev.text}
                            onChange={e => {
                              const arr = [...d.events]; arr[i].text = e.target.value;
                              updateBlockData(bIdx, 'events', arr);
                            }}
                          />
                          <Button size="sm" color="red" onClick={() => {
                            const arr = d.events.filter((_, idx) => idx !== i);
                            updateBlockData(bIdx, 'events', arr);
                          }}>Remover</Button>
                        </div>
                      ))}
                      <Button size="sm" color="green" onClick={() => updateBlockData(bIdx, 'events', [...d.events, { date:'', text:'' }])}>
                        Adicionar Evento
                      </Button>
                    </>
                  )}
                  {blk.type === 'quiz' && (
                    <>
                      {d.questions.map((q,i) => (
                        <Card key={i} className="bg-gray-800 p-3 space-y-2">
                          <Input
                            labelProps={{ className: 'text-white' }}
                            label={`Pergunta ${i+1}`}
                            value={q.question}
                            onChange={e => {
                              const arr = [...d.questions]; arr[i].question = e.target.value;
                              updateBlockData(bIdx, 'questions', arr);
                            }}
                          />
                          <RadioGroup
                            name={`quiz-${bIdx}-${i}`}
                            value={String(q.answerIndex)}
                            onChange={val => {
                              const arr = [...d.questions]; arr[i].answerIndex = +val;
                              updateBlockData(bIdx, 'questions', arr);
                            }}
                            className="flex flex-col gap-2"
                          >
                            {q.options.map((o,oi) => (
                              <Radio
                                key={oi}
                                value={String(oi)}
                                label={o}
                                color="red"
                                className="text-white"
                              />
                            ))}
                          </RadioGroup>
                          {q.options.map((o,oi) => (
                            <div key={oi} className="flex items-center gap-2">
                              <Input
                                labelProps={{ className: 'text-white' }}
                                value={o}
                                onChange={e => {
                                  const arr = [...d.questions];
                                  arr[i].options[oi] = e.target.value;
                                  updateBlockData(bIdx, 'questions', arr);
                                }}
                              />
                              <Button size="sm" color="red" onClick={() => {
                                const arr = q.options.filter((_, idx) => idx !== oi);
                                const arrQ = [...d.questions]; arrQ[i].options = arr;
                                updateBlockData(bIdx, 'questions', arrQ);
                              }}>Remover Opção</Button>
                            </div>
                          ))}
                          <Button size="sm" color="green" onClick={() => {
                            const arrQ = [...d.questions]; arrQ[i].options.push('');
                            updateBlockData(bIdx, 'questions', arrQ);
                          }}>Adicionar Opção</Button>
                          <Button size="sm" color="red" onClick={() => {
                            const arrQ = d.questions.filter((_, idx) => idx !== i);
                            updateBlockData(bIdx, 'questions', arrQ);
                          }}>Remover Pergunta</Button>
                        </Card>
                      ))}
                      <Button size="sm" color="green" onClick={() => {
                        const arr = [...d.questions, { question:'', options:[''], answerIndex:0 }];
                        updateBlockData(bIdx, 'questions', arr);
                      }}>Adicionar Pergunta</Button>
                    </>
                  )}

                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* Navegação entre etapas */}
        <div className="flex justify-between pt-6 border-t border-gray-700 mt-8">
          <Button
            variant="text"
            color="white"
            onClick={goPrev}
            disabled={currentIdx === 0}
            startIcon={<ChevronLeftIcon className="h-5 w-5 text-white" />}
          >
            Anterior
          </Button>
          <div className="flex space-x-2">
            <Button
              variant="text"
              color="red"
              onClick={removeStep}
              disabled={total <= 1}
              startIcon={<TrashIcon className="h-5 w-5 text-white" />}
            >
              Remover Etapa
            </Button>
            <Button
              variant="text"
              color="green"
              onClick={addStep}
              startIcon={<PlusIcon className="h-5 w-5 text-white" />}
            >
              Adicionar Etapa
            </Button>
          </div>
          <Button
            variant="text"
            color="white"
            onClick={goNext}
            disabled={currentIdx === total - 1}
            endIcon={<ChevronRightIcon className="h-5 w-5 text-white" />}
          >
            Próxima
          </Button>
        </div>

      </CardBody>
    </Card>
  );
}
