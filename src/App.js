import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import './App.css';

function App() {
  const [processes, setProcesses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    objective: '',
    steps: [''],
    requirements: '',
    risks: '',
    approvedBy: '',
    version: '1.0',
    date: new Date().toISOString().split('T')[0],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState('list');

  // Cargar procesos del localStorage
  useEffect(() => {
    const saved = localStorage.getItem('processes');
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
    localStorage.setItem('processes', JSON.stringify(updatedProcesses));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData((prev) => ({ ...prev, steps: newSteps }));
  };

  const addStep = () => {
    setFormData((prev) => ({ ...prev, steps: [...prev.steps, ''] }));
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
      steps: [''],
      requirements: '',
      risks: '',
      approvedBy: '',
      version: '1.0',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleEdit = (process) => {
    setFormData(process);
    setIsEditing(true);
    setEditingId(process.id);
    setView('form');
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proceso?')) {
      saveProcesses(processes.filter((p) => p.id !== id));
    }
  };

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

    // Encabezado corporativo
    pdf.setFillColor(25, 35, 65);
    pdf.rect(0, 0, pageWidth, 30, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont(undefined, 'bold');
    pdf.text('DOCUMENTACIÓN DE PROCESO', margin, 12);

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.text(`Versión: ${process.version}`, margin, 20);
    pdf.text(`Fecha: ${process.date}`, pageWidth - margin - 30, 20);

    yPosition = 45;

    // Título del proceso
    pdf.setTextColor(25, 35, 65);
    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.text(process.name, margin, yPosition);
    yPosition += 10;

    // Objetivo
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(80, 80, 80);
    pdf.text('OBJETIVO:', margin, yPosition);
    yPosition += 6;

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(0, 0, 0);
    const objectiveLines = pdf.splitTextToSize(
      process.objective,
      pageWidth - 2 * margin
    );
    pdf.text(objectiveLines, margin, yPosition);
    yPosition += objectiveLines.length * 5 + 5;

    // Requisitos
    if (process.requirements) {
      pdf.setFontSize(11);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(80, 80, 80);
      pdf.text('REQUISITOS:', margin, yPosition);
      yPosition += 6;

      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(0, 0, 0);
      const reqLines = pdf.splitTextToSize(
        process.requirements,
        pageWidth - 2 * margin
      );
      pdf.text(reqLines, margin, yPosition);
      yPosition += reqLines.length * 5 + 5;
    }

    // Pasos
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(80, 80, 80);
    pdf.text('PASOS DEL PROCESO:', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(0, 0, 0);

    process.steps.forEach((step, index) => {
      if (step.trim()) {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setFont(undefined, 'bold');
        pdf.setTextColor(25, 35, 65);
        pdf.text(`${index + 1}.`, margin, yPosition);

        pdf.setFont(undefined, 'normal');
        pdf.setTextColor(0, 0, 0);
        const stepLines = pdf.splitTextToSize(
          step,
          pageWidth - 2 * margin - 10
        );
        pdf.text(stepLines, margin + 10, yPosition);
        yPosition += stepLines.length * 5 + 6;
      }
    });

    yPosition += 8;

    // Riesgos
    if (process.risks) {
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(11);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(80, 80, 80);
      pdf.text('RIESGOS IDENTIFICADOS:', margin, yPosition);
      yPosition += 6;

      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(0, 0, 0);
      const riskLines = pdf.splitTextToSize(
        process.risks,
        pageWidth - 2 * margin
      );
      pdf.text(riskLines, margin, yPosition);
      yPosition += riskLines.length * 5 + 10;
    }

    // Pie de página con firma
    if (yPosition < pageHeight - 25) {
      yPosition = pageHeight - 25;
    }

    pdf.setDrawColor(180, 180, 180);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(80, 80, 80);
    pdf.text('Aprobado por:', margin, yPosition);
    pdf.text(
      process.approvedBy || '_____________________',
      margin,
      yPosition + 8
    );

    // Descargar
    pdf.save(`Proceso_${process.name.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1>📋 Documentador de Procesos</h1>
          <p>Sistema profesional para documentación formal de procesos empresariales</p>
        </div>
      </header>

      <main className="main">
        {view === 'list' ? (
          <>
            <div className="header-actions">
              <h2>Procesos documentados ({processes.length})</h2>
              <button
                onClick={() => {
                  resetForm();
                  setView('form');
                }}
                className="btn btn-primary"
              >
                ➕ Nuevo Proceso
              </button>
            </div>

            {processes.length === 0 ? (
              <div className="empty-state">
                <p>No hay procesos documentados aún. Crea el primero ahora.</p>
              </div>
            ) : (
              <div className="processes-grid">
                {processes.map((process) => (
                  <div key={process.id} className="process-card">
                    <h3>{process.name}</h3>
                    <p>{process.objective.substring(0, 100)}...</p>
                    <div className="process-meta">
                      <span>v{process.version}</span>
                      <span>•</span>
                      <span>{process.date}</span>
                    </div>
                    <div className="process-actions">
                      <button
                        onClick={() => generatePDF(process)}
                        className="btn btn-success"
                      >
                        📥 PDF
                      </button>
                      <button
                        onClick={() => handleEdit(process)}
                        className="btn btn-info"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(process.id)}
                        className="btn btn-danger"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="form-container">
            <h2>{isEditing ? '✏️ Editar Proceso' : '➕ Nuevo Proceso'}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
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
              </div>

              <div className="form-group">
                <label>Objetivo del Proceso *</label>
                <textarea
                  name="objective"
                  value={formData.objective}
                  onChange={handleInputChange}
                  placeholder="Describe brevemente el objetivo y propósito de este proceso"
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

              <div className="form-group">
                <div className="form-group-header">
                  <label>Pasos del Proceso *</label>
                  <button
                    type="button"
                    onClick={addStep}
                    className="btn btn-small"
                  >
                    + Agregar paso
                  </button>
                </div>
                {formData.steps.map((step, index) => (
                  <div key={index} className="step-input">
                    <span className="step-number">{index + 1}</span>
                    <textarea
                      value={step}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                      placeholder={`Paso ${index + 1}: Describe el paso detalladamente`}
                      rows="2"
                    />
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
                    setView('list');
                  }}
                  className="btn btn-secondary"
                >
                  ← Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
