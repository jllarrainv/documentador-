import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import './App.css';

// Logo Blue Express como componente SVG
const BlueExpressLogo = ({ width = 160, white = true }) => (
  <svg width={width} height={width * 0.35} viewBox="0 0 200 70" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={white ? '#FFFFFF' : '#0033A0'} />
        <stop offset="100%" stopColor={white ? '#B8D4F0' : '#00A3E0'} />
      </linearGradient>
    </defs>
    <text x="0" y="38" fontFamily="'Segoe UI', Arial, sans-serif" fontSize="42" fontWeight="800" fill="url(#logoGrad)" letterSpacing="-1">
      blue
    </text>
    <text x="0" y="62" fontFamily="'Segoe UI', Arial, sans-serif" fontSize="24" fontWeight="600" fill={white ? 'rgba(255,255,255,0.8)' : '#00A3E0'} letterSpacing="4">
      EXPRESS
    </text>
    <rect x="115" y="10" width="4" height="28" rx="2" fill="#00A3E0" />
  </svg>
);

function App() {
  const [processes, setProcesses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    objective: '',
    steps: [{ text: '', image: null }],
    requirements: '',
    risks: '',
    approvedBy: '',
    version: '1.0',
    date: new Date().toISOString().split('T')[0],
    headerImage: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState('list');
  const [previewProcess, setPreviewProcess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);

  // Cargar procesos del localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bluex_processes');
    if (saved) {
      try {
        setProcesses(JSON.parse(saved));
      } catch (error) {
        console.error('Error al cargar procesos:', error);
      }
    }
  }, []);

  // Guardar procesos en localStorage
  const saveProcesses = (updatedProcesses) => {
    setProcesses(updatedProcesses);
    localStorage.setItem('bluex_processes', JSON.stringify(updatedProcesses));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...formData.steps];
    newSteps[index] = { ...newSteps[index], text: value };
    setFormData((prev) => ({ ...prev, steps: newSteps }));
  };

  const handleStepImage = (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const newSteps = [...formData.steps];
      newSteps[index] = { ...newSteps[index], image: e.target.result };
      setFormData((prev) => ({ ...prev, steps: newSteps }));
    };
    reader.readAsDataURL(file);
  };

  const removeStepImage = (index) => {
    const newSteps = [...formData.steps];
    newSteps[index] = { ...newSteps[index], image: null };
    setFormData((prev) => ({ ...prev, steps: newSteps }));
  };

  const handleHeaderImage = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData((prev) => ({ ...prev, headerImage: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const addStep = () => {
    setFormData((prev) => ({
      ...prev,
      steps: [...prev.steps, { text: '', image: null }],
    }));
  };

  const removeStep = (index) => {
    if (formData.steps.length > 1) {
      setFormData((prev) => ({
        ...prev,
        steps: prev.steps.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('El nombre del proceso es requerido');
      return;
    }

    if (isEditing) {
      const updated = processes.map((p) =>
        p.id === editingId ? { ...formData, id: editingId } : p
      );
      saveProcesses(updated);
      setIsEditing(false);
      setEditingId(null);
    } else {
      const newProcess = {
        ...formData,
        id: Date.now().toString(),
      };
      saveProcesses([...processes, newProcess]);
    }

    resetForm();
    setView('list');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      objective: '',
      steps: [{ text: '', image: null }],
      requirements: '',
      risks: '',
      approvedBy: '',
      version: '1.0',
      date: new Date().toISOString().split('T')[0],
      headerImage: null,
    });
  };

  const handleEdit = (process) => {
    // Compatibilidad: convertir steps string a objeto
    const steps = process.steps.map((s) =>
      typeof s === 'string' ? { text: s, image: null } : s
    );
    setFormData({ ...process, steps, headerImage: process.headerImage || null });
    setIsEditing(true);
    setEditingId(process.id);
    setView('form');
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proceso?')) {
      saveProcesses(processes.filter((p) => p.id !== id));
      if (previewProcess && previewProcess.id === id) {
        setPreviewProcess(null);
      }
    }
  };

  const getStepText = (step) => (typeof step === 'string' ? step : step.text);
  const getStepImage = (step) => (typeof step === 'string' ? null : step.image);

  const generatePDF = (process) => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    let yPosition = margin;

    // Encabezado corporativo Blue Express
    pdf.setFillColor(0, 51, 160);
    pdf.rect(0, 0, pageWidth, 32, 'F');

    // Línea accent
    pdf.setFillColor(0, 163, 224);
    pdf.rect(0, 32, pageWidth, 3, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.setFont(undefined, 'bold');
    pdf.text('blue', margin, 14);
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    pdf.text('EXPRESS', margin, 22);

    pdf.setFontSize(9);
    pdf.text('DOCUMENTACIÓN DE PROCESO', pageWidth - margin - 55, 14);
    pdf.text(`Versión: ${process.version}`, pageWidth - margin - 55, 20);
    pdf.text(`Fecha: ${process.date}`, pageWidth - margin - 55, 26);

    yPosition = 48;

    // Título del proceso
    pdf.setTextColor(0, 51, 160);
    pdf.setFontSize(18);
    pdf.setFont(undefined, 'bold');
    pdf.text(process.name, margin, yPosition);
    yPosition += 12;

    // Objetivo
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(0, 51, 160);
    pdf.text('OBJETIVO', margin, yPosition);
    yPosition += 2;
    pdf.setDrawColor(0, 163, 224);
    pdf.setLineWidth(0.8);
    pdf.line(margin, yPosition, margin + 30, yPosition);
    yPosition += 6;

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(60, 60, 60);
    const objectiveLines = pdf.splitTextToSize(
      process.objective,
      pageWidth - 2 * margin
    );
    pdf.text(objectiveLines, margin, yPosition);
    yPosition += objectiveLines.length * 5 + 8;

    // Requisitos
    if (process.requirements) {
      pdf.setFontSize(11);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(0, 51, 160);
      pdf.text('REQUISITOS', margin, yPosition);
      yPosition += 2;
      pdf.setDrawColor(0, 163, 224);
      pdf.line(margin, yPosition, margin + 30, yPosition);
      yPosition += 6;

      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(60, 60, 60);
      const reqLines = pdf.splitTextToSize(
        process.requirements,
        pageWidth - 2 * margin
      );
      pdf.text(reqLines, margin, yPosition);
      yPosition += reqLines.length * 5 + 8;
    }

    // Pasos
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(0, 51, 160);
    pdf.text('PASOS DEL PROCESO', margin, yPosition);
    yPosition += 2;
    pdf.setDrawColor(0, 163, 224);
    pdf.line(margin, yPosition, margin + 45, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);

    process.steps.forEach((step, index) => {
      const text = getStepText(step);
      if (text && text.trim()) {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = margin;
        }

        // Número en círculo
        pdf.setFillColor(0, 51, 160);
        pdf.circle(margin + 4, yPosition - 1, 4, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFont(undefined, 'bold');
        pdf.setFontSize(8);
        pdf.text(`${index + 1}`, margin + 2.5, yPosition + 1);

        pdf.setFont(undefined, 'normal');
        pdf.setTextColor(60, 60, 60);
        pdf.setFontSize(10);
        const stepLines = pdf.splitTextToSize(text, pageWidth - 2 * margin - 15);
        pdf.text(stepLines, margin + 14, yPosition);
        yPosition += stepLines.length * 5 + 8;
      }
    });

    yPosition += 4;

    // Riesgos
    if (process.risks) {
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFillColor(255, 240, 240);
      const riskLines = pdf.splitTextToSize(process.risks, pageWidth - 2 * margin - 10);
      const riskBoxHeight = riskLines.length * 5 + 16;
      pdf.roundedRect(margin, yPosition - 4, pageWidth - 2 * margin, riskBoxHeight, 3, 3, 'F');

      pdf.setFontSize(11);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(200, 50, 50);
      pdf.text('RIESGOS IDENTIFICADOS', margin + 5, yPosition + 4);

      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(80, 80, 80);
      pdf.text(riskLines, margin + 5, yPosition + 12);
      yPosition += riskBoxHeight + 10;
    }

    // Pie de página
    const footerY = pageHeight - 20;
    pdf.setDrawColor(0, 163, 224);
    pdf.setLineWidth(0.5);
    pdf.line(margin, footerY, pageWidth - margin, footerY);

    pdf.setFontSize(9);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(0, 51, 160);
    pdf.text('Aprobado por:', margin, footerY + 8);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(60, 60, 60);
    pdf.text(
      process.approvedBy || '_____________________________',
      margin + 25,
      footerY + 8
    );

    pdf.setTextColor(150, 150, 150);
    pdf.setFontSize(8);
    pdf.text('Blue Express — Documentación de Procesos', pageWidth - margin - 60, footerY + 8);

    // Descargar
    pdf.save(`Proceso_${process.name.replace(/\s+/g, '_')}.pdf`);
  };

  const filteredProcesses = processes.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.objective.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <BlueExpressLogo width={140} white={true} />
            <div className="header-divider"></div>
            <div>
              <h1 className="header-title">Documentador de Procesos</h1>
              <p className="header-subtitle">Gestión documental empresarial</p>
            </div>
          </div>
          <div className="header-right">
            <span className="header-badge">{processes.length} procesos</span>
          </div>
        </div>
        <div className="header-accent-line"></div>
      </header>

      <main className="main">
        {/* ── LIST VIEW ── */}
        {view === 'list' && !previewProcess && (
          <>
            <div className="toolbar">
              <div className="search-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Buscar procesos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setIsEditing(false);
                  setView('form');
                }}
                className="btn btn-primary"
              >
                + Nuevo Proceso
              </button>
            </div>

            {filteredProcesses.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <p>
                  {searchTerm
                    ? 'No se encontraron procesos con esa búsqueda'
                    : 'Aún no hay procesos documentados. Crea el primero.'}
                </p>
              </div>
            ) : (
              <div className="processes-grid">
                {filteredProcesses.map((process) => (
                  <div key={process.id} className="process-card">
                    {process.headerImage && (
                      <div className="card-image-wrap">
                        <img src={process.headerImage} alt="" className="card-image" />
                      </div>
                    )}
                    <div className="card-body">
                      <div className="card-version-row">
                        <span className="version-tag">v{process.version}</span>
                        <span className="card-date">{process.date}</span>
                      </div>
                      <h3 className="card-title">{process.name}</h3>
                      <p className="card-desc">
                        {process.objective?.substring(0, 120)}
                        {process.objective?.length > 120 ? '...' : ''}
                      </p>
                      <div className="card-meta">
                        <span>{process.steps?.length || 0} pasos</span>
                        {process.approvedBy && (
                          <span>• Aprobado: {process.approvedBy}</span>
                        )}
                      </div>
                      <div className="card-actions">
                        <button
                          className="btn btn-view"
                          onClick={() => setPreviewProcess(process)}
                        >
                          👁 Ver
                        </button>
                        <button
                          className="btn btn-pdf"
                          onClick={() => generatePDF(process)}
                        >
                          📥 PDF
                        </button>
                        <button
                          className="btn btn-edit"
                          onClick={() => handleEdit(process)}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(process.id)}
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── PREVIEW VIEW ── */}
        {previewProcess && view === 'list' && (
          <div className="preview-wrapper">
            <button
              className="btn btn-secondary back-btn"
              onClick={() => setPreviewProcess(null)}
            >
              ← Volver a la lista
            </button>

            <div className="preview-doc">
              <div className="doc-header">
                {previewProcess.headerImage && (
                  <img
                    src={previewProcess.headerImage}
                    alt=""
                    className="doc-header-bg"
                  />
                )}
                <div className="doc-header-content">
                  <BlueExpressLogo width={120} white={true} />
                  <span className="doc-label">DOCUMENTACIÓN DE PROCESO</span>
                  <h2 className="doc-title">{previewProcess.name}</h2>
                  <div className="doc-meta-row">
                    <span>Versión {previewProcess.version}</span>
                    <span>•</span>
                    <span>{previewProcess.date}</span>
                    {previewProcess.approvedBy && (
                      <>
                        <span>•</span>
                        <span>Aprobado por: {previewProcess.approvedBy}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="doc-body">
                <div className="doc-section">
                  <h3 className="doc-section-title">Objetivo</h3>
                  <p className="doc-text">{previewProcess.objective}</p>
                </div>

                {previewProcess.requirements && (
                  <div className="doc-section">
                    <h3 className="doc-section-title">Requisitos</h3>
                    <p className="doc-text">{previewProcess.requirements}</p>
                  </div>
                )}

                <div className="doc-section">
                  <h3 className="doc-section-title">Pasos del Proceso</h3>
                  <div className="steps-timeline">
                    {previewProcess.steps.map((step, i) => {
                      const text = getStepText(step);
                      const img = getStepImage(step);
                      if (!text?.trim() && !img) return null;
                      return (
                        <div key={i} className="timeline-item">
                          <div className="timeline-dot">
                            <span>{i + 1}</span>
                          </div>
                          <div className="timeline-content">
                            <p className="doc-text">{text}</p>
                            {img && (
                              <img
                                src={img}
                                alt={`Paso ${i + 1}`}
                                className="step-preview-image"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {previewProcess.risks && (
                  <div className="doc-section doc-section-risk">
                    <h3 className="doc-section-title risk-title">
                      ⚠ Riesgos Identificados
                    </h3>
                    <p className="doc-text">{previewProcess.risks}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── FORM VIEW ── */}
        {view === 'form' && (
          <div>
            <button
              className="btn btn-secondary back-btn"
              onClick={() => {
                resetForm();
                setIsEditing(false);
                setView('list');
              }}
            >
              ← Volver
            </button>

            <div className="form-container">
              <div className="form-header">
                <h2>{isEditing ? 'Editar Proceso' : 'Nuevo Proceso'}</h2>
                <p>Completa los campos para documentar el proceso</p>
              </div>

              <form onSubmit={handleSubmit} className="form-body">
                {/* Imagen de portada */}
                <div className="form-group">
                  <label>Imagen de portada (opcional)</label>
                  <div
                    className="image-dropzone"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {formData.headerImage ? (
                      <div className="dropzone-preview">
                        <img src={formData.headerImage} alt="" />
                        <button
                          type="button"
                          className="remove-img-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData((prev) => ({ ...prev, headerImage: null }));
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="dropzone-placeholder">
                        <span className="dropzone-icon">🖼</span>
                        <span>Click para agregar imagen de portada</span>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleHeaderImage(e.target.files[0])}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Nombre del Proceso *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: Proceso de Aprobación de Compras"
                    required
                  />
                </div>

                <div className="form-row-inline">
                  <div className="form-group">
                    <label>Versión</label>
                    <input
                      type="text"
                      name="version"
                      value={formData.version}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Fecha</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Objetivo del Proceso *</label>
                  <textarea
                    name="objective"
                    value={formData.objective}
                    onChange={handleInputChange}
                    placeholder="Describe el objetivo y propósito de este proceso"
                    required
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>Requisitos</label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    placeholder="Lista los requisitos necesarios para ejecutar este proceso"
                    rows="3"
                  />
                </div>

                {/* Pasos con imágenes */}
                <div className="form-group">
                  <div className="form-group-header">
                    <label>Pasos del Proceso *</label>
                    <button
                      type="button"
                      onClick={addStep}
                      className="btn btn-add-step"
                    >
                      + Agregar paso
                    </button>
                  </div>
                  {formData.steps.map((step, index) => (
                    <div key={index} className="step-input">
                      <span className="step-number">{index + 1}</span>
                      <div className="step-content">
                        <textarea
                          value={step.text}
                          onChange={(e) =>
                            handleStepChange(index, e.target.value)
                          }
                          placeholder={`Describe el paso ${index + 1} detalladamente`}
                          rows="2"
                        />
                        {/* Imagen del paso */}
                        {step.image ? (
                          <div className="step-img-preview">
                            <img src={step.image} alt="" />
                            <button
                              type="button"
                              className="remove-step-img"
                              onClick={() => removeStepImage(index)}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="btn-add-image"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e) =>
                                handleStepImage(index, e.target.files[0]);
                              input.click();
                            }}
                          >
                            🖼 Agregar imagen al paso
                          </button>
                        )}
                      </div>
                      {formData.steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStep(index)}
                          className="btn btn-remove"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="form-group">
                  <label>Riesgos Identificados</label>
                  <textarea
                    name="risks"
                    value={formData.risks}
                    onChange={handleInputChange}
                    placeholder="Describe los riesgos potenciales asociados a este proceso"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Aprobado por</label>
                  <input
                    type="text"
                    name="approvedBy"
                    value={formData.approvedBy}
                    onChange={handleInputChange}
                    placeholder="Nombre y cargo del aprobador"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {isEditing ? '💾 Guardar Cambios' : '💾 Guardar Proceso'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setIsEditing(false);
                      setView('list');
                    }}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <BlueExpressLogo width={100} white={false} />
        <p>Documentador de Procesos — Blue Express</p>
      </footer>
    </div>
  );
}

export default App;
