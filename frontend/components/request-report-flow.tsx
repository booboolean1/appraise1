'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ArrowRight, Mail, FileQuestion } from 'lucide-react';

export function RequestReportFlow({ onComplete }: { onComplete: () => void }) {
  const [hasReport, setHasReport] = useState<boolean | null>(null);
  const [reason, setReason] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const generateEmail = () => {
    const body = `Dear [Lender Name],

I am writing to formally request a copy of the appraisal report for the property located at [Your Property Address]. This request is for the purpose of [${reason}].

As per the Equal Credit Opportunity Act (ECOA), I am entitled to receive a copy of the appraisal report. Please provide me with a copy of the report at your earliest convenience.

Thank you for your prompt attention to this matter.

Sincerely,
[Your Name]`;
    setEmailBody(body);
  };

  return (
    <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-2xl mt-4">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <FileQuestion className="w-5 h-5 text-orange-400" />
        Request Your Appraisal Report
      </h3>
      
      <div className="space-y-4">
        <p className="text-gray-300">Do you have a copy of your appraisal report?</p>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="has-report-yes" checked={hasReport === true} onCheckedChange={() => setHasReport(true)} />
            <Label htmlFor="has-report-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="has-report-no" checked={hasReport === false} onCheckedChange={() => setHasReport(false)} />
            <Label htmlFor="has-report-no">No</Label>
          </div>
        </div>

        {hasReport === false && (
          <div className="space-y-4 pt-4 border-t border-gray-700/50">
            <p className="text-gray-300">Why do you need the report?</p>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="reason-purchase" onCheckedChange={() => setReason('Purchase')} />
                <Label htmlFor="reason-purchase">Home Purchase</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="reason-refinance" onCheckedChange={() => setReason('Refinance')} />
                <Label htmlFor="reason-refinance">Refinance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="reason-dispute" onCheckedChange={() => setReason('Dispute')} />
                <Label htmlFor="reason-dispute">Dispute a Low Valuation</Label>
              </div>
            </div>
            <Button onClick={generateEmail} disabled={!reason}>
              <Mail className="w-4 h-4 mr-2" />
              Generate Request Email
            </Button>
          </div>
        )}

        {emailBody && (
          <div className="space-y-4 pt-4 border-t border-gray-700/50">
            <p className="text-gray-300">Copy the email below and send it to your lender:</p>
            <Textarea value={emailBody} readOnly rows={10} className="bg-gray-800/50 border-gray-600/50 text-white" />
            <Button onClick={onComplete}>
              I've Sent the Email
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}