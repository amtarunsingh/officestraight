import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWizardStore } from '@/features/ordering-wizard/store';
import { useCasePatent } from '@/features/ordering-wizard/useCasePatent';
import { PatentSidebar } from '@/shared/components/PatentSidebar';
import { Button, Card, InputField, Badge, Steps, Divider, FooterActions } from '@/shared/components/ui';
import { cn } from '@/shared/lib/utils';

const QUOTE_STEPS = ['Service Selection', 'Word Count', 'Quote Details'];

const WORD_COUNT_FIELDS = [
  { key: 'numberOfClaims', label: 'No. of claims' },
  { key: 'wordsInClaims', label: 'No. of words in claims' },
  { key: 'independentClaims', label: 'No. of independent claims' },
  { key: 'wordsInDescription', label: 'No. of words in description' },
  { key: 'totalPages', label: 'Total number of pages' },
  { key: 'pagesOfClaims', label: 'No. of pages of claims' },
  { key: 'totalWords', label: 'Total number of words' },
  { key: 'pagesOfDescription', label: 'No. of pages of description' },
  { key: 'pagesOfDrawings', label: 'No. of pages of drawings' },
  { key: 'pagesOfSequenceListing', label: 'No. of pages of sequence listing' },
] as const;

export default function WordCountPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const store = useWizardStore();
  const { patent } = useCasePatent();
  const mode = store.wordCountMode;

  const handleSave = useCallback(() => {
    if (mode === 'guaranteed') {
      // Save and return to My Cases — Valipat does the word count
      navigate('/?saved=true');
    } else {
      navigate(`/case/${caseId}/quote-details`);
    }
  }, [caseId, mode, navigate]);

  return (
    <div className="flex gap-5">
      <div className="flex-1">
        <Steps steps={QUOTE_STEPS} current={2} />

        <Card>
          <h3 className="text-base font-bold text-navy mb-1">Word Count</h3>

          {/* Fast track */}
          <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-300 mb-4">
            <div className="font-bold text-sm text-navy mb-1">Fast track order</div>
            <p className="text-xs text-gray-500 mb-2">
              Valipat offers the automated generation of an online quote based on a word count of your patent.
            </p>
            <p className="text-xs text-gray-500 mb-3">
              If you do not know the number of words contained in your patent and/or if you do not need an online quote, you can{' '}
              <strong>order directly without a preliminary online quote.</strong>
            </p>
            <Button
              variant="gold"
              size="md"
              onClick={() => navigate(`/case/${caseId}/instructions`)}
            >
              Skip the quote and order now
            </Button>
          </div>

          <Divider />

          {/* Mode selection */}
          <div className="flex gap-3 mb-5">
            <div
              onClick={() => store.setField('wordCountMode', 'estimate')}
              className={cn(
                'flex-1 p-4 rounded-lg cursor-pointer border-2 transition-colors',
                mode === 'estimate' ? 'border-navy bg-indigo-50/50' : 'border-gray-300 bg-white',
              )}
            >
              <div className="font-bold text-sm text-navy mb-1">📊 I know the word count</div>
              <div className="text-xs text-gray-500 mb-1.5">Provide your numbers for an instant online quote.</div>
              <Badge color="info">Instant quote</Badge>
            </div>
            <div
              onClick={() => store.setField('wordCountMode', 'guaranteed')}
              className={cn(
                'flex-1 p-4 rounded-lg cursor-pointer border-2 transition-colors',
                mode === 'guaranteed' ? 'border-gold bg-amber-50/50' : 'border-gray-300 bg-white',
              )}
            >
              <div className="font-bold text-sm text-gold mb-1">✓ Guaranteed quote</div>
              <div className="text-xs text-gray-500 mb-1.5">Valipat performs the word count. Ready within 2 business days.</div>
              <Badge color="gold">Fixed price</Badge>
            </div>
          </div>

          {/* Estimate mode: word count form */}
          {mode === 'estimate' && (
            <div>
              <p className="text-xs text-gray-500 mb-3">Enter your word count. Fields cannot be blank to proceed.</p>
              <div className="grid grid-cols-2 gap-3">
                {WORD_COUNT_FIELDS.map(({ key, label }) => (
                  <InputField
                    key={key}
                    label={label}
                    type="number"
                    value={store.wordCount[key as keyof typeof store.wordCount] ?? 0}
                    onChange={(e) =>
                      store.updateWordCount(
                        key as keyof typeof store.wordCount,
                        parseInt(e.target.value, 10) || 0,
                      )
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* Guaranteed mode: confirmation + comment box */}
          {mode === 'guaranteed' && (
            <div>
              <div className="p-5 bg-amber-50 rounded-lg border border-amber-300 text-center mb-4">
                <div className="text-4xl mb-2">⏳</div>
                <div className="font-bold text-base text-navy mb-1">Valipat Word Count Requested</div>
                <div className="text-sm text-gray-500">
                  Case saved. Quote available within <strong>24-48 hours</strong>. You'll be notified by email.
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                <label className="block text-xs font-semibold text-navy mb-1.5">
                  For any specific request, please fill in the field below
                </label>
                <textarea
                  placeholder="e.g. Please prioritise the word count for Egypt and Libya as the deadline is approaching..."
                  value={store.guaranteedQuoteComment}
                  onChange={(e) => store.setField('guaranteedQuoteComment', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-navy bg-white resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-navy/20"
                />
              </div>
            </div>
          )}
        </Card>

        <FooterActions
          onCancel={() => navigate('/')}
          onSave={handleSave}
          saveLabel={mode === 'guaranteed' ? 'Save & return to My Cases' : 'Save and continue'}
        />
      </div>

      <PatentSidebar patent={patent} />
    </div>
  );
}
