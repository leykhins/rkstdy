import { useState } from "react";

type FormData = {
  name: string;
  email: string;
  phone: string;
  services: string[];
  message: string;
};

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  services: [],
  message: "",
};

const TOTAL_STEPS = 3;

export default function QuoteForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const nextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (step < 3 && canProceed()) {
      setStep((s) => s + 1);
    }
  };

  const prevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (step > 1) {
      setStep((s) => s - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 3) return;
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setStep(1);
    setSubmitted(false);
  };

  const canProceed = (): boolean => {
    if (step === 1) {
      return formData.name.trim() !== "" && formData.email.trim() !== "" && formData.phone.trim() !== "";
    }
    if (step === 2) {
      return formData.services.length > 0;
    }
    return true;
  };

  if (submitted) {
    return (
      <div className="quote-form-container">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2 className="success-title">Thank You!</h2>
          <p className="success-text">We've received your request and will be in touch soon.</p>
          <button type="button" className="btn-reset" onClick={resetForm}>
            Submit Another Request
          </button>
        </div>
        <style>{`
          .quote-form-container {
            font-family: "Switzer", sans-serif;
          }
          .success-message {
            text-align: center;
            padding: 20px 0;
          }
          .success-icon {
            width: 48px;
            height: 48px;
            background: #22c55e;
            color: white;
            font-size: 24px;
            font-weight: bold;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 12px;
          }
          .success-title {
            font-family: "Switzer", sans-serif;
            font-size: 20px;
            font-weight: 700;
            color: #0b0b0b;
            margin: 0 0 6px;
            letter-spacing: -0.02em;
          }
          .success-text {
            font-size: 14px;
            color: #666;
            margin: 0 0 14px;
            line-height: 1.5;
          }
          .btn-reset {
            padding: 10px 18px;
            font-family: inherit;
            font-size: 13px;
            font-weight: 500;
            color: #666;
            background: #f0f0f0;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.2s;
          }
          .btn-reset:hover {
            background: #e5e5e5;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="quote-form-container">
      <h2 className="form-title">Get a Free Quote</h2>

      {/* Progress indicator */}
      <div className="form-progress">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`progress-step ${step >= s ? "active" : ""} ${step === s ? "current" : ""}`}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Contact Info */}
        {step === 1 && (
          <div className="form-step">
            <div className="form-group">
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* Step 2: Service Selection */}
        {step === 2 && (
          <div className="form-step">
            <p className="step-label">What services do you need? (select all that apply)</p>
            <div className="service-options">
              {[
                { value: "plumbing", label: "Plumbing" },
                { value: "hvac", label: "HVAC" },
                { value: "furnace", label: "Furnace" },
                { value: "water-heater", label: "Water Heater" },
                { value: "other", label: "Other" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`service-option ${formData.services.includes(option.value) ? "selected" : ""}`}
                  onClick={() => toggleService(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Message */}
        {step === 3 && (
          <div className="form-step">
            <div className="form-group">
              <textarea
                placeholder="Tell us about your project (optional)"
                value={formData.message}
                onChange={(e) => updateField("message", e.target.value)}
                rows={4}
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="form-nav">
          {step > 1 && (
            <button type="button" className="btn-back" onClick={(e) => prevStep(e)}>
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              className={`btn-next ${!canProceed() ? "disabled" : ""}`}
              onClick={(e) => nextStep(e)}
            >
              Next
            </button>
          ) : (
            <button type="submit" className="btn-submit">
              Request Quote
            </button>
          )}
        </div>
      </form>

      <style>{`
        .quote-form-container {
          font-family: "Switzer", sans-serif;
        }

        .form-title {
          font-family: "Switzer", sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #0b0b0b;
          margin: 0 0 14px;
          letter-spacing: -0.02em;
        }

        .form-progress {
          display: flex;
          gap: 6px;
          margin-bottom: 16px;
        }

        .progress-step {
          flex: 1;
          height: 3px;
          background: #e5e5e5;
          border-radius: 2px;
          transition: background 0.3s;
        }

        .progress-step.active {
          background: var(--brand-red);
        }

        .form-step {
          min-height: 120px;
        }

        .step-label {
          font-size: 13px;
          color: #666;
          margin: 0 0 10px;
        }

        .form-group {
          margin-bottom: 10px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          font-family: inherit;
          font-size: 14px;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          background: #f9f9f9;
          color: #1d1d1d;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #aaa;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--brand-red);
          box-shadow: 0 0 0 2px rgba(210, 31, 31, 0.1);
          background: white;
        }

        .form-group textarea {
          resize: none;
        }

        .service-options {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .service-option {
          padding: 8px 14px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          color: #555;
          background: #f3f3f3;
          border: 2px solid transparent;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .service-option:hover {
          background: #eaeaea;
        }

        .service-option.selected {
          background: #fef2f2;
          border-color: var(--brand-red);
          color: var(--brand-red);
          padding-left: 28px;
        }

        .service-option.selected::before {
          content: "✓";
          position: absolute;
          left: 10px;
          font-size: 11px;
          font-weight: bold;
        }

        .form-nav {
          display: flex;
          gap: 8px;
          margin-top: 14px;
        }

        .btn-back {
          flex: 1;
          padding: 12px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          color: #666;
          background: #f0f0f0;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-back:hover {
          background: #e5e5e5;
        }

        .btn-next,
        .btn-submit {
          flex: 2;
          padding: 12px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          background: var(--brand-red);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s, opacity 0.2s;
        }

        .btn-next:hover:not(.disabled),
        .btn-submit:hover {
          background: var(--brand-red-hover);
        }

        .btn-next.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }

        .btn-next:active:not(.disabled),
        .btn-submit:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}
