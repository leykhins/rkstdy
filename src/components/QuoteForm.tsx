import { useState } from "react";
import { Check, CheckCircle2, Loader2, Mail, MessageSquare, Phone, User2, Wrench } from "lucide-react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

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

export default function QuoteForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 3) return;
    setError("");
    setIsSubmitting(true);
    try {
      const body = new FormData();
      body.set("name", formData.name);
      body.set("email", formData.email);
      body.set("phone", formData.phone);
      formData.services.forEach((service) => body.append("services", service));
      body.set("message", formData.message);

      const response = await fetch("/api/quote", {
        method: "POST",
        body,
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Unable to send your request. Please try again.");
      }
      setSubmitted(true);

      // GA4: track successful quote submission
      if (typeof window.gtag === "function") {
        window.gtag("event", "submit_quote", {
          event_category: "engagement",
          services: formData.services.join(", "),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setStep(1);
    setSubmitted(false);
    setError("");
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
          <div className="success-icon">
            <CheckCircle2 aria-hidden="true" />
          </div>
          <h2 className="success-title">Thank You!</h2>
          <p className="success-text">We&apos;ve received your request and will be in touch soon.</p>
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
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 12px;
          }
          .success-icon svg {
            width: 24px;
            height: 24px;
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
            <div className="form-group with-icon">
              <User2 className="input-icon" aria-hidden="true" />
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
            </div>
            <div className="form-group with-icon">
              <Mail className="input-icon" aria-hidden="true" />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
              />
            </div>
            <div className="form-group with-icon">
              <Phone className="input-icon" aria-hidden="true" />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => updateField("phone", formatPhoneNumber(e.target.value))}
                required
              />
            </div>
          </div>
        )}

        {/* Step 2: Service Selection */}
        {step === 2 && (
          <div className="form-step">
            <p className="step-label">
              <Wrench className="step-icon" aria-hidden="true" />
              What services do you need? (select all that apply)
            </p>
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
                  {formData.services.includes(option.value) && (
                    <span className="service-option-check" aria-hidden="true">
                      <Check />
                    </span>
                  )}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Message */}
        {step === 3 && (
          <div className="form-step">
            <div className="form-group with-icon">
              <MessageSquare className="input-icon" aria-hidden="true" />
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
            <button type="button" className="btn-back" onClick={(e) => prevStep(e)} disabled={isSubmitting}>
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              className={`btn-next ${!canProceed() || isSubmitting ? "disabled" : ""}`}
              onClick={(e) => nextStep(e)}
              disabled={!canProceed() || isSubmitting}
              suppressHydrationWarning
            >
              Next
            </button>
          ) : (
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="btn-loading">
                  <Loader2 className="spin" aria-hidden="true" />
                  Sending...
                </span>
              ) : (
                "Request Quote"
              )}
            </button>
          )}
        </div>
        {isSubmitting && (
          <div className="form-loading" role="status" aria-live="polite">
            <Loader2 className="spin" aria-hidden="true" />
            Sending your request...
          </div>
        )}
        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}
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
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .step-icon {
          width: 14px;
          height: 14px;
          color: var(--brand-red);
        }

        .form-group {
          margin-bottom: 10px;
          position: relative;
        }

        .form-group.with-icon input,
        .form-group.with-icon textarea {
          padding-left: 38px;
        }

        .input-icon {
          position: absolute;
          top: 50%;
          left: 12px;
          width: 16px;
          height: 16px;
          color: #9a9a9a;
          transform: translateY(-50%);
          pointer-events: none;
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
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .service-option:hover {
          background: #eaeaea;
        }

        .service-option.selected {
          background: #fef2f2;
          border-color: var(--brand-red);
          color: var(--brand-red);
          padding-left: 30px;
        }

        .service-option-check {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          left: 8px;
          color: var(--brand-red);
        }

        .service-option-check svg {
          width: 14px;
          height: 14px;
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

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: wait;
        }

        .btn-next:active:not(.disabled),
        .btn-submit:active {
          transform: scale(0.98);
        }

        .btn-loading {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .form-loading {
          margin-top: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #6b7280;
        }

        .form-error {
          margin-top: 10px;
          font-size: 13px;
          color: #b91c1c;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
