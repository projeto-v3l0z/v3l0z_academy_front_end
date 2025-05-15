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
    'heading',
    'text',
    'video',
    'image',
    'code',
    'checklist',
    'alert',
    'embed',
    'audio',
    'table',
    'accordion',
    'timeline',
    'quiz',
  ];
  const [newBlockType, setNewBlockType] = useState(blockTypes[0]);

  // Navegação de etapas
  const goPrev = () => setCurrentIdx(i => Math.max(i - 1, 0));
  const goNext = () => setCurrentIdx(i => Math.min(i + 1, total - 1));

  // CRUD de etapas
  const addStep = () => {
    setSteps([
      ...steps,
      { id: null, title: '', description: '', order: steps.length + 1, content: { blocks: [] } },
    ]);
    setCurrentIdx(steps.length);
  };
  const removeStep = () => {
    if (total <= 1) return;
    const filtered = steps.filter((_, i) => i !== currentIdx);
    setSteps(filtered.map((s, i) => ({ ...s, order: i + 1 })));
    setCurrentIdx(i => Math.max(i - 1, 0));
  };
  const updateStepField = (field, value) => {
    setSteps(steps.map((s, i) => i === currentIdx ? { ...s, [field]: value } : s));
  };

  // Movimentar/remover blocos
  const moveBlock = (idx, dir) => {
    const copy = [...steps];
    const blocks = copy[currentIdx].content.blocks;
    const t = idx + dir;
    if (t < 0 || t >= blocks.length) return;
    [blocks[idx], blocks[t]] = [blocks[t], blocks[idx]];
    setSteps(copy);
  };
  const removeBlock = i => {
    const copy = [...steps];
    copy[currentIdx].content.blocks.splice(i, 1);
    setSteps(copy);
  };

  // Adicionar bloco com defaults
  const addBlock = type => {
    const copy = [...steps];
    const blocks = copy[currentIdx].content.blocks || [];
    let blk = { id: null, type, data: {} };
    switch (type) {
      case 'heading':    blk.data = { level: 2, text: '' }; break;
      case 'text':       blk.data = { text: '' }; break;
      case 'video':      blk.data = { provider: 'youtube', videoId: '' }; break;
      case 'image':      blk.data = { src: '', alt: '' }; break;
      case 'code':       blk.data = { language: 'javascript', code: '' }; break;
      case 'checklist':  blk.data = { items: [] }; break;
      case 'alert':      blk.data = { style: 'info', text: '' }; break;
      case 'embed':      blk.data = { embedHtml: '' }; break;
      case 'audio':      blk.data = { src: '' }; break;
      case 'table':      blk.data = { headers: [''], rows: [['']] }; break;
      case 'accordion':  blk.data = { items: [{ title: '', content: '' }] }; break;
      case 'timeline':   blk.data = { events: [{ date: '', text: '' }] }; break;
      case 'quiz':       blk.data = { questions: [{ question: '', options: [''], answerIndex: 0 }] }; break;
      default:           break;
    }
    blocks.push(blk);
    copy[currentIdx].content.blocks = blocks;
    setSteps(copy);
  };

  const updateBlockData = (bIdx, key, value) => {
    const copy = [...steps];
    copy[currentIdx].content.blocks[bIdx].data[key] = value;
    setSteps(copy);
  };

  return (
    <Card className="bg-black text-white p-6 rounded-2xl shadow-2xl">
      <CardBody className="space-y-6">

        {/* Progresso de Etapas */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-1 bg-gray-700 rounded-full" />
          </div>
          <div className="relative flex justify-between">
            {steps.map((_, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                  ${i === currentIdx ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                  {i + 1}
                </div>
                <Typography variant="small" className="mt-1 text-xs text-gray-400 truncate max-w-[80px]">
                  {steps[i]?.title || `Etapa ${i+1}`}
                </Typography>
              </div>
            ))}
          </div>
        </div>

        {/* Etapa Atual */}
        <Typography variant="h6">Etapa {currentIdx + 1} de {total}</Typography>
        <Input
          label="Título da Etapa"
          labelProps={{ className: 'text-white' }}
          value={current.title}
          onChange={e => updateStepField('title', e.target.value)}
        />
        <Textarea
          label="Descrição"
          labelProps={{ className: 'text-white' }}
          value={current.description}
          onChange={e => updateStepField('description', e.target.value)}
        />

        {/* Selector de Bloco */}
        <div className="flex items-center gap-4 mb-6">
          <Select
            value={newBlockType}
            onChange={setNewBlockType}
            className="bg-gray-800 text-white"
            labelProps={{ className: 'text-white' }}
          >
            {blockTypes.map(t => (
              <Option key={t} value={t} className="capitalize">{t}</Option>
            ))}
          </Select>
          <Button color="green" onClick={() => addBlock(newBlockType)}>
            <PlusIcon className="h-5 w-5 mr-1" /> Adicionar Bloco
          </Button>
        </div>

        {/* Blocos da Etapa */}
        <div className="space-y-6">
          {current.content.blocks.map((blk, bIdx) => {
            const d = blk.data;
            return (
              <Card key={bIdx} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <CardBody className="space-y-4">
                  {/* Header com mover/remover */}
                  <div className="flex justify-between items-center border-b border-gray-600 pb-2">
                    <Typography className="capitalize font-semibold text-red-400">
                      {blk.type}
                    </Typography>
                    <div className="flex items-center gap-2">
                      <Button variant="text" size="sm" color="white" ripple={false}
                        onClick={() => moveBlock(bIdx, -1)}><ChevronUpIcon className="h-5 w-5"/></Button>
                      <Button variant="text" size="sm" color="white" ripple={false}
                        onClick={() => moveBlock(bIdx, +1)}><ChevronDownIcon className="h-5 w-5"/></Button>
                      <Button variant="text" size="sm" color="red" ripple={false}
                        onClick={() => removeBlock(bIdx)}><TrashIcon className="h-5 w-5"/></Button>
                    </div>
                  </div>

                  {/* Renderização por tipo */}
                  {blk.type === 'heading' && (
                    <>
                      <Input
                        label="Nível (1–6)"
                        type="number"
                        labelProps={{ className:'text-white' }}
                        value={d.level}
                        onChange={e => updateBlockData(bIdx,'level',+e.target.value||1)}
                      />
                      <Textarea
                        label="Texto"
                        labelProps={{ className:'text-white' }}
                        value={d.text}
                        onChange={e => updateBlockData(bIdx,'text',e.target.value)}
                      />
                    </>
                  )}

                  {blk.type === 'text' && (
                    <Textarea
                      label="Texto"
                      labelProps={{ className:'text-white' }}
                      value={d.text}
                      onChange={e => updateBlockData(bIdx,'text',e.target.value)}
                    />
                  )}

                  {blk.type === 'video' && (
                    <>
                      <Input
                        label="Link de embed (YouTube ou Vimeo)"
                        value={d.url || ''}
                        onChange={e => {
                          const val = e.target.value.trim();
                          if (/vimeo\.com/.test(val)) {
                            updateBlockData(bIdx, 'provider', 'vimeo');
                            updateBlockData(bIdx, 'url', val);
                            updateBlockData(bIdx, 'videoId', '');
                          } else {
                            updateBlockData(bIdx, 'provider', 'youtube');
                            updateBlockData(bIdx, 'videoId', extractYouTubeId(val));
                            updateBlockData(bIdx, 'url', '');
                          }
                        }}
                      />
                    </>
                  )}


                  {blk.type === 'image' && (
                    <>
                      <Input
                        label="URL da imagem"
                        labelProps={{ className:'text-white' }}
                        value={d.src}
                        onChange={e => updateBlockData(bIdx,'src',e.target.value)}
                      />
                      <Input
                        label="Alt text"
                        labelProps={{ className:'text-white' }}
                        value={d.alt}
                        onChange={e => updateBlockData(bIdx,'alt',e.target.value)}
                      />
                    </>
                  )}

                  {blk.type === 'code' && (
                    <>
                      <Input
                        label="Linguagem"
                        labelProps={{ className:'text-white' }}
                        value={d.language}
                        onChange={e => updateBlockData(bIdx,'language',e.target.value)}
                      />
                      <Textarea
                        label="Código"
                        labelProps={{ className:'text-white' }}
                        value={d.code}
                        onChange={e => updateBlockData(bIdx,'code',e.target.value)}
                      />
                    </>
                  )}

                  {blk.type === 'checklist' && (
                    <div className="space-y-2">
                      {d.items.map((it,i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Checkbox
                            labelProps={{ className:'text-white' }}
                            checked={it.checked}
                            onChange={e => {
                              const arr = [...d.items];
                              arr[i].checked = e.target.checked;
                              updateBlockData(bIdx,'items',arr);
                            }}
                          />
                          <Input
                            labelProps={{ className:'text-white' }}
                            value={it.text}
                            onChange={e => {
                              const arr = [...d.items];
                              arr[i].text = e.target.value;
                              updateBlockData(bIdx,'items',arr);
                            }}
                          />
                          <Button size="sm" color="red" variant="text" onClick={() => {
                            const arr = d.items.filter((_,idx) => idx !== i);
                            updateBlockData(bIdx,'items',arr);
                          }}>Remover</Button>
                        </div>
                      ))}
                      <Button size="sm" color="green" onClick={() =>
                        updateBlockData(bIdx,'items',[...d.items,{text:'',checked:false}])
                      }>Adicionar Item</Button>
                    </div>
                  )}

                  {blk.type === 'alert' && (
                    <>
                      <Select
                        label="Estilo"
                        value={d.style}
                        onChange={val => updateBlockData(bIdx,'style',val)}
                        className="bg-gray-800 text-white"
                        labelProps={{ className:'text-white' }}
                      >
                        <Option value="info">Info</Option>
                        <Option value="success">Success</Option>
                        <Option value="warning">Warning</Option>
                        <Option value="danger">Danger</Option>
                      </Select>
                      <Textarea
                        label="Texto"
                        labelProps={{ className:'text-white' }}
                        value={d.text}
                        onChange={e => updateBlockData(bIdx,'text',e.target.value)}
                      />
                    </>
                  )}

                  {blk.type === 'embed' && (
                    <Textarea
                      label="Cole o HTML completo do <iframe> (Vimeo/YouTube)"
                      labelProps={{ className:'text-white' }}
                      value={d.embedHtml}
                      onChange={e => updateBlockData(bIdx,'embedHtml',e.target.value)}
                      className="h-32"
                    />
                  )}

                  {blk.type === 'audio' && (
                    <Input
                      label="URL do áudio"
                      labelProps={{ className:'text-white' }}
                      value={d.src}
                      onChange={e => updateBlockData(bIdx,'src',e.target.value)}
                    />
                  )}

                                    {/* Table */}
                                    {blk.type === 'table' && (
                    <>
                      <Typography className="text-white font-semibold">Cabeçalhos</Typography>
                      {d.headers.map((h, i) => (
                        <Input
                          key={i}
                          labelProps={{ className: 'text-white' }}
                          label={`Coluna ${i+1}`}
                          value={h}
                          onChange={e => {
                            const arr = [...d.headers];
                            arr[i] = e.target.value;
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

                  {/* Accordion */}
                  {blk.type === 'accordion' && (
                    <>
                      {d.items.map((it, i) => (
                        <div key={i} className="space-y-2">
                          <Input
                            labelProps={{ className: 'text-white' }}
                            label="Título"
                            value={it.title}
                            onChange={e => {
                              const arr = [...d.items];
                              arr[i].title = e.target.value;
                              updateBlockData(bIdx, 'items', arr);
                            }}
                          />
                          <Textarea
                            labelProps={{ className: 'text-white' }}
                            label="Conteúdo"
                            value={it.content}
                            onChange={e => {
                              const arr = [...d.items];
                              arr[i].content = e.target.value;
                              updateBlockData(bIdx, 'items', arr);
                            }}
                          />
                          <Button size="sm" color="red" onClick={() => {
                            const arr = d.items.filter((_, idx) => idx !== i);
                            updateBlockData(bIdx, 'items', arr);
                          }}>Remover</Button>
                        </div>
                      ))}
                      <Button size="sm" color="green" onClick={() => updateBlockData(bIdx, 'items', [...d.items, { title: '', content: '' }])}>
                        Adicionar Item
                      </Button>
                    </>
                  )}

                  {/* Timeline */}
                  {blk.type === 'timeline' && (
                    <>
                      {d.events.map((ev, i) => (
                        <div key={i} className="space-y-2">
                          <Input
                            labelProps={{ className: 'text-white' }}
                            label="Data"
                            value={ev.date}
                            onChange={e => {
                              const arr = [...d.events];
                              arr[i].date = e.target.value;
                              updateBlockData(bIdx, 'events', arr);
                            }}
                          />
                          <Textarea
                            labelProps={{ className: 'text-white' }}
                            label="Texto"
                            value={ev.text}
                            onChange={e => {
                              const arr = [...d.events];
                              arr[i].text = e.target.value;
                              updateBlockData(bIdx, 'events', arr);
                            }}
                          />
                          <Button size="sm" color="red" onClick={() => {
                            const arr = d.events.filter((_, idx) => idx !== i);
                            updateBlockData(bIdx, 'events', arr);
                          }}>Remover</Button>
                        </div>
                      ))}
                      <Button size="sm" color="green" onClick={() => updateBlockData(bIdx, 'events', [...d.events, { date: '', text: '' }])}>
                        Adicionar Evento
                      </Button>
                    </>
                  )}

                  {/* Quiz */}
                  {blk.type === 'quiz' && (
                    <>
                      {d.questions.map((q, i) => (
                        <Card key={i} className="bg-gray-800 p-3 space-y-2">
                          <Input
                            labelProps={{ className: 'text-white' }}
                            label={`Pergunta ${i+1}`}
                            value={q.question}
                            onChange={e => {
                              const arr = [...d.questions];
                              arr[i].question = e.target.value;
                              updateBlockData(bIdx, 'questions', arr);
                            }}
                          />
                          <RadioGroup
                            name={`quiz-${bIdx}-${i}`}
                            value={String(q.answerIndex)}
                            onChange={val => {
                              const arr = [...d.questions];
                              arr[i].answerIndex = +val;
                              updateBlockData(bIdx, 'questions', arr);
                            }}
                            className="flex flex-col gap-2"
                          >
                            {q.options.map((o, oi) => (
                              <Radio
                                key={oi}
                                value={String(oi)}
                                label={o}
                                color="red"
                                className="text-white"
                              />
                            ))}
                          </RadioGroup>
                          {q.options.map((o, oi) => (
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
                                const arrOpts = q.options.filter((_, idx) => idx !== oi);
                                const arrQ = [...d.questions];
                                arrQ[i].options = arrOpts;
                                updateBlockData(bIdx, 'questions', arrQ);
                              }}>Remover Opção</Button>
                            </div>
                          ))}
                          <Button size="sm" color="green" onClick={() => {
                            const arrQ = [...d.questions];
                            arrQ[i].options.push('');
                            updateBlockData(bIdx, 'questions', arrQ);
                          }}>Adicionar Opção</Button>
                          <Button size="sm" color="red" onClick={() => {
                            const arrQ = d.questions.filter((_, idx) => idx !== i);
                            updateBlockData(bIdx, 'questions', arrQ);
                          }}>Remover Pergunta</Button>
                        </Card>
                      ))}
                      <Button size="sm" color="green" onClick={() => {
                        const arr = [...d.questions, { question: '', options: [''], answerIndex: 0 }];
                        updateBlockData(bIdx, 'questions', arr);
                      }}>Adicionar Pergunta</Button>
                    </>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* Navegação entre blocos */}
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
