import { useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import './PreviewDataEditor.css';

interface PreviewDataEditorProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ExperienceEntry {
    company: string;
    jobtitle: string;
    startyear: string;
    endyear: string;
    isPresent: boolean;
    description: string;
}

interface ExperienceSection {
    sectionName: string;
    deleteable: boolean;
    entries: ExperienceEntry[];
}

interface EducationEntry {
    department: string;
    school: string;
    level: string;
    startyear: string;
    endyear: string;
    isPresent: boolean;
}

export default function PreviewDataEditor({ isOpen, onClose }: PreviewDataEditorProps) {
    const { previewData, setPreviewData } = useEditorStore();
    const [editMode, setEditMode] = useState<'form' | 'json'>('form');
    const [jsonInput, setJsonInput] = useState(JSON.stringify(previewData, null, 2));
    const [formData, setFormData] = useState(JSON.parse(JSON.stringify(previewData)));
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSave = () => {
        try {
            if (editMode === 'json') {
                const parsed = JSON.parse(jsonInput);
                setPreviewData(parsed);
                setFormData(parsed);
            } else {
                setPreviewData(formData);
                setJsonInput(JSON.stringify(formData, null, 2));
            }
            setError(null);
            onClose();
        } catch {
            setError('Invalid JSON format. Please check your syntax.');
        }
    };

    const handleReset = () => {
        setFormData(JSON.parse(JSON.stringify(previewData)));
        setJsonInput(JSON.stringify(previewData, null, 2));
        setError(null);
    };

    const handleCancel = () => {
        setFormData(JSON.parse(JSON.stringify(previewData)));
        setJsonInput(JSON.stringify(previewData, null, 2));
        setError(null);
        onClose();
    };

    const updateField = (path: string, value: string) => {
        const newData = JSON.parse(JSON.stringify(formData));
        const keys = path.split('.');
        let current = newData;

        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = value;
        setFormData(newData);
    };

    const updateArrayItem = (path: string, index: number, value: string) => {
        const newData = JSON.parse(JSON.stringify(formData));
        const keys = path.split('.');
        let current = newData;

        for (const key of keys) {
            current = current[key];
        }

        current[index] = value;
        setFormData(newData);
    };

    const addArrayItem = (path: string, defaultValue: string | Record<string, unknown>) => {
        const newData = JSON.parse(JSON.stringify(formData));
        const keys = path.split('.');
        let current = newData;

        for (const key of keys) {
            current = current[key];
        }

        current.push(defaultValue);
        setFormData(newData);
    };

    const removeArrayItem = (path: string, index: number) => {
        const newData = JSON.parse(JSON.stringify(formData));
        const keys = path.split('.');
        let current = newData;

        for (const key of keys) {
            current = current[key];
        }

        current.splice(index, 1);
        setFormData(newData);
    };

    const renderFormEditor = () => {
        const pd = formData.personalData || {};
        const skills = formData.skills || [];
        const education = formData.education || [];
        const experinceSections = formData.experinceSections || [];

        return (
            <div className="form-editor">
                {/* Personal Data Section */}
                <div className="form-section">
                    <h3>Personal Information</h3>

                    <div className="form-field">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={pd.fullname || ''}
                            onChange={(e) => updateField('personalData.fullname', e.target.value)}
                        />
                    </div>

                    <div className="form-field">
                        <label>Email</label>
                        <input
                            type="email"
                            value={pd.email || ''}
                            onChange={(e) => updateField('personalData.email', e.target.value)}
                        />
                    </div>

                    <div className="form-field">
                        <label>Phone</label>
                        <input
                            type="tel"
                            value={pd.phone || ''}
                            onChange={(e) => updateField('personalData.phone', e.target.value)}
                        />
                    </div>

                    <div className="form-field">
                        <label>Location</label>
                        <input
                            type="text"
                            value={pd.location || ''}
                            onChange={(e) => updateField('personalData.location', e.target.value)}
                        />
                    </div>

                    <div className="form-field">
                        <label>Portfolio (Optional)</label>
                        <input
                            type="url"
                            value={pd.protfilio || ''}
                            onChange={(e) => updateField('personalData.protfilio', e.target.value)}
                            placeholder="https://yourwebsite.com"
                        />
                    </div>

                    <div className="form-field">
                        <label>Professional Summary (Optional)</label>
                        <textarea
                            value={pd.summary || ''}
                            onChange={(e) => updateField('personalData.summary', e.target.value)}
                            rows={4}
                            placeholder="Brief professional summary..."
                        />
                    </div>
                </div>

                {/* Skills Section */}
                <div className="form-section">
                    <h3>Skills</h3>
                    {skills.map((skill: string, index: number) => (
                        <div key={index} className="array-item">
                            <input
                                type="text"
                                value={skill}
                                onChange={(e) => updateArrayItem('skills', index, e.target.value)}
                            />
                            <button
                                type="button"
                                className="remove-btn"
                                onClick={() => removeArrayItem('skills', index)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="add-btn"
                        onClick={() => addArrayItem('skills', '')}
                    >
                        + Add Skill
                    </button>
                </div>

                {/* Education Section */}
                <div className="form-section">
                    <h3>Education</h3>
                    {education.map((edu: EducationEntry, index: number) => (
                        <div key={index} className="nested-item">
                            <div className="nested-header">
                                <h4>Education #{index + 1}</h4>
                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => removeArrayItem('education', index)}
                                >
                                    ✕ Remove
                                </button>
                            </div>
                            <div className="form-field">
                                <label>Department</label>
                                <input
                                    type="text"
                                    value={edu.department || ''}
                                    onChange={(e) => {
                                        const newData = { ...formData };
                                        newData.education[index].department = e.target.value;
                                        setFormData(newData);
                                    }}
                                />
                            </div>
                            <div className="form-field">
                                <label>School</label>
                                <input
                                    type="text"
                                    value={edu.school || ''}
                                    onChange={(e) => {
                                        const newData = { ...formData };
                                        newData.education[index].school = e.target.value;
                                        setFormData(newData);
                                    }}
                                />
                            </div>
                            <div className="form-field">
                                <label>Level</label>
                                <select
                                    value={edu.level || 'bachelors'}
                                    onChange={(e) => {
                                        const newData = { ...formData };
                                        newData.education[index].level = e.target.value;
                                        setFormData(newData);
                                    }}
                                >
                                    <option value="bachelors">Bachelor's</option>
                                    <option value="masters">Master's</option>
                                    <option value="phd">PhD</option>
                                    <option value="diploma">Diploma</option>
                                </select>
                            </div>
                            <div className="form-row">
                                <div className="form-field">
                                    <label>Start Year</label>
                                    <input
                                        type="text"
                                        value={edu.startyear || ''}
                                        onChange={(e) => {
                                            const newData = { ...formData };
                                            newData.education[index].startyear = e.target.value;
                                            setFormData(newData);
                                        }}
                                    />
                                </div>
                                <div className="form-field">
                                    <label>End Year</label>
                                    <input
                                        type="text"
                                        value={edu.endyear || ''}
                                        onChange={(e) => {
                                            const newData = { ...formData };
                                            newData.education[index].endyear = e.target.value;
                                            setFormData(newData);
                                        }}
                                    />
                                </div>
                                <div className="form-field">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={edu.isPresent || false}
                                            onChange={(e) => {
                                                const newData = { ...formData };
                                                newData.education[index].isPresent = e.target.checked;
                                                if (e.target.checked) {
                                                    newData.education[index].endyear = 'Present';
                                                }
                                                setFormData(newData);
                                            }}
                                        />
                                        {' '}Present
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="add-btn"
                        onClick={() => addArrayItem('education', {
                            department: '',
                            school: '',
                            level: 'bachelors',
                            startyear: '',
                            endyear: '',
                            isPresent: false
                        })}
                    >
                        + Add Education
                    </button>
                </div>

                {/* Experience Section */}
                <div className="form-section">
                    <div className="section-header">
                        <h3>Experience Sections</h3>
                        <button
                            type="button"
                            className="add-btn"
                            onClick={() => {
                                const newData = { ...formData };
                                if (!newData.experinceSections) {
                                    newData.experinceSections = [];
                                }
                                newData.experinceSections.push({
                                    sectionName: 'New Section',
                                    deleteable: true,
                                    entries: []
                                });
                                setFormData(newData);
                            }}
                        >
                            + Add Section
                        </button>
                    </div>
                    {experinceSections.map((section: ExperienceSection, sectionIndex: number) => (
                        <div key={sectionIndex} className="experience-section nested-item">
                            <div className="nested-header">
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Section Name"
                                    value={section.sectionName || ''}
                                    onChange={(e) => {
                                        const newData = { ...formData };
                                        newData.experinceSections[sectionIndex].sectionName = e.target.value;
                                        setFormData(newData);
                                    }}
                                />
                                {section.deleteable && (
                                    <button
                                        type="button"
                                        className="remove-btn"
                                        onClick={() => {
                                            const newData = { ...formData };
                                            newData.experinceSections.splice(sectionIndex, 1);
                                            setFormData(newData);
                                        }}
                                    >
                                        Remove Section
                                    </button>
                                )}
                            </div>

                            {(section.entries || []).map((entry: ExperienceEntry, entryIndex: number) => (
                                <div key={entryIndex} className="nested-item">
                                    <div className="nested-header">
                                        <h4>Entry #{entryIndex + 1}</h4>
                                        <button
                                            type="button"
                                            className="remove-btn"
                                            onClick={() => {
                                                const newData = { ...formData };
                                                newData.experienceSections[sectionIndex].entries.splice(entryIndex, 1);
                                                setFormData(newData);
                                            }}
                                        >
                                            ✕ Remove
                                        </button>
                                    </div>
                                    <div className="form-field">
                                        <label>Company</label>
                                        <input
                                            type="text"
                                            value={entry.company || ''}
                                            onChange={(e) => {
                                                const newData = { ...formData };
                                                newData.experienceSections[sectionIndex].entries[entryIndex].company = e.target.value;
                                                setFormData(newData);
                                            }}
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label>Job Title</label>
                                        <input
                                            type="text"
                                            value={entry.jobtitle || ''}
                                            onChange={(e) => {
                                                const newData = { ...formData };
                                                newData.experienceSections[sectionIndex].entries[entryIndex].jobtitle = e.target.value;
                                                setFormData(newData);
                                            }}
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>Start Year</label>
                                            <input
                                                type="text"
                                                value={entry.startyear || ''}
                                                onChange={(e) => {
                                                    const newData = { ...formData };
                                                    newData.experinceSections[sectionIndex].entries[entryIndex].startyear = e.target.value;
                                                    setFormData(newData);
                                                }}
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>End Year</label>
                                            <input
                                                type="text"
                                                value={entry.endyear || ''}
                                                onChange={(e) => {
                                                    const newData = { ...formData };
                                                    newData.experinceSections[sectionIndex].entries[entryIndex].endyear = e.target.value;
                                                    setFormData(newData);
                                                }}
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={entry.isPresent || false}
                                                    onChange={(e) => {
                                                        const newData = { ...formData };
                                                        newData.experinceSections[sectionIndex].entries[entryIndex].isPresent = e.target.checked;
                                                        if (e.target.checked) {
                                                            newData.experinceSections[sectionIndex].entries[entryIndex].endyear = 'Present';
                                                        }
                                                        setFormData(newData);
                                                    }}
                                                />
                                                {' '}Present
                                            </label>
                                        </div>
                                    </div>
                                    <div className="form-field">
                                        <label>Description</label>
                                        <textarea
                                            value={entry.description || ''}
                                            onChange={(e) => {
                                                const newData = { ...formData };
                                                newData.experinceSections[sectionIndex].entries[entryIndex].description = e.target.value;
                                                setFormData(newData);
                                            }}
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="add-btn"
                                onClick={() => {
                                    const newData = { ...formData };
                                    if (!newData.experinceSections[sectionIndex].entries) {
                                        newData.experinceSections[sectionIndex].entries = [];
                                    }
                                    newData.experinceSections[sectionIndex].entries.push({
                                        company: '',
                                        jobtitle: '',
                                        startyear: '',
                                        endyear: '',
                                        isPresent: false,
                                        description: ''
                                    });
                                    setFormData(newData);
                                }}
                            >
                                + Add Experience Entry
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="modal-overlay" onClick={handleCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Preview Data</h2>
                    <div className="mode-toggle">
                        <button
                            className={`mode-btn ${editMode === 'form' ? 'active' : ''}`}
                            onClick={() => setEditMode('form')}
                        >
                            📝 Form
                        </button>
                        <button
                            className={`mode-btn ${editMode === 'json' ? 'active' : ''}`}
                            onClick={() => {
                                setJsonInput(JSON.stringify(formData, null, 2));
                                setEditMode('json');
                            }}
                        >
                            { } JSON
                        </button>
                    </div>
                    <button className="close-button" onClick={handleCancel}>×</button>
                </div>

                <div className="modal-body">
                    {error && <div className="error-message">{error}</div>}

                    {editMode === 'form' ? (
                        renderFormEditor()
                    ) : (
                        <>
                            <p className="modal-description">
                                Edit the JSON data below to customize preview values.
                            </p>
                            <textarea
                                className="json-editor"
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                                spellCheck={false}
                            />
                        </>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="modal-button secondary" onClick={handleReset}>
                        Reset to Current
                    </button>
                    <button className="modal-button secondary" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button className="modal-button primary" onClick={handleSave}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
