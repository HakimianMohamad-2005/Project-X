import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, Building2, Download, ExternalLink, FileText, Lock, Phone, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LeadForm } from '../types';
import { saveLeadSampleToApi } from '../lib/api';
import { Button, Field, Modal, SuccessState, buttonClass, inputClass } from './ui/kit';

interface SamplePdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PDF_PATH = '/orangutan-plus3-sample-36-pages.pdf';
const PDF_NAME = 'orangutan-plus3-sample-36-pages.pdf';
const EMPTY_FORM: LeadForm = { fullName: '', phone: '', organization: '', position: '' };

async function downloadSample() {
  try {
    // Fetch as a Blob so the browser saves the full file instead of previewing it.
    const response = await fetch(PDF_PATH);
    if (!response.ok) throw new Error('File fetch failed');
    const blobUrl = URL.createObjectURL(await response.blob());
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = PDF_NAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
  } catch (err) {
    console.error('Blob download failed, falling back to direct link', err);
    const link = document.createElement('a');
    link.href = PDF_PATH;
    link.download = PDF_NAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const SamplePdfModal: React.FC<SamplePdfModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<LeadForm>(EMPTY_FORM);
  const [downloadReady, setDownloadReady] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setDownloadReady(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDownloadReady(true);
    saveLeadSampleToApi(form);
    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, colors: ['#D9894A', '#FFD3A1', '#B87333'] });
    } catch (err) {
      console.warn('Confetti animation error:', err);
    }
    downloadSample();
  };

  return (
    <Modal open={isOpen} onClose={onClose} size="lg">
      <div className="grid sm:grid-cols-5">
        {/* Visual side */}
        <div className="relative hidden sm:flex sm:col-span-2 items-center justify-center overflow-hidden rounded-s-[2rem] bg-[#0A0A0B] p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(184,115,51,0.35),transparent_65%)]" />
          <div className="relative [perspective:900px]">
            {[2, 1, 0].map((i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-lg bg-[#F3ECE0] shadow-lg"
                style={{ transform: `translate(${i * 7}px, ${i * 7}px) rotate(${i * 2}deg)`, opacity: 1 - i * 0.2 }}
              />
            ))}
            <img
              src="/Jeld%20-%20Front.png"
              alt=""
              className="relative w-40 rounded-lg shadow-[0_30px_50px_-20px_rgba(0,0,0,0.9)] [transform:rotateY(-14deg)]"
            />
            <span className="absolute -bottom-3 -start-3 rounded-full bg-gradient-to-br from-[#D9894A] to-[#7A3E14] px-3 py-1.5 text-xs font-black text-white shadow-lg">
              {t('ui.sample.badge')}
            </span>
          </div>
        </div>

        <div className="sm:col-span-3 p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-3 pe-12">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-copper/15 text-copper-hi border border-copper/25 sm:hidden">
              <FileText className="w-5 h-5" />
            </span>
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-black">{t('ui.sample.title')}</h3>
              <p className="text-xs leading-6 text-ink-3">{t('ui.sample.subtitle')}</p>
            </div>
          </div>

          {!downloadReady ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label={t('ui.sample.fullName')} icon={User} required>
                <input
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder={t('ui.sample.fullNamePlaceholder')}
                  autoComplete="name"
                  className={inputClass}
                />
              </Field>
              <Field label={t('ui.sample.phone')} icon={Phone} required>
                <input
                  required
                  type="tel"
                  dir="ltr"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="09xx xxx xxxx"
                  autoComplete="tel"
                  className={`${inputClass} text-start`}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={t('ui.sample.organization')} icon={Building2} hint={t('ui.common.optional')}>
                  <input
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label={t('ui.sample.position')} icon={Briefcase} hint={t('ui.common.optional')}>
                  <input
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                    placeholder={t('ui.sample.positionPlaceholder')}
                    className={inputClass}
                  />
                </Field>
              </div>
              <Button type="submit" size="lg" className="w-full">
                <Download className="w-5 h-5" />
                {t('ui.sample.submit')}
              </Button>
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-ink-3">
                <Lock className="w-3 h-3" />
                {t('ui.sample.privacy')}
              </p>
            </form>
          ) : (
            <SuccessState title={t('ui.sample.readyTitle')} text={t('ui.sample.readyText')}>
              <div className="w-full space-y-2.5">
                <Button variant="success" size="lg" className="w-full" onClick={downloadSample}>
                  <Download className="w-5 h-5" />
                  {t('ui.sample.download')}
                </Button>
                <a href={PDF_PATH} target="_blank" rel="noopener noreferrer" className={buttonClass('secondary', 'md', 'w-full')}>
                  <ExternalLink className="w-4 h-4" />
                  {t('ui.sample.read')}
                </a>
              </div>
            </SuccessState>
          )}
        </div>
      </div>
    </Modal>
  );
};
