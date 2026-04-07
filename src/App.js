import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import './App.css';

// Logo Blue Express como imagen
const BLUEX_LOGO = 'data:image/png;base64,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';
 
const BlueExpressLogo = ({ width = 160, white = true }) => (
  <img
    src={BLUEX_LOGO}
    alt="Blue Express"
    style={{
      width: width,
      height: 'auto',
      background: white ? 'rgba(255,255,255,0.95)' : 'transparent',
      borderRadius: white ? 8 : 0,
      padding: white ? 6 : 0,
    }}
  />
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
