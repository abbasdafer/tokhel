// Summarizes a novel's content into a three-line summary, potentially drawing inspiration from existing summaries.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNovelInputSchema = z.object({
  novelContent: z.string().describe('The complete content of the novel.'),
  existingSummaries: z
    .array(z.string())
    .optional()
    .describe('Optional array of existing summaries to inspire the new summary.'),
});
export type SummarizeNovelInput = z.infer<typeof SummarizeNovelInputSchema>;

const SummarizeNovelOutputSchema = z.object({
  summary: z.string().describe('A concise, three-line summary of the novel.'),
});
export type SummarizeNovelOutput = z.infer<typeof SummarizeNovelOutputSchema>;

export async function summarizeNovel(input: SummarizeNovelInput): Promise<SummarizeNovelOutput> {
  return summarizeNovelFlow(input);
}

const summarizeNovelPrompt = ai.definePrompt({
  name: 'summarizeNovelPrompt',
  input: {schema: SummarizeNovelInputSchema},
  output: {schema: SummarizeNovelOutputSchema},
  prompt: `You are an expert in creating captivating three-line summaries for novels.

  Your goal is to provide a preview that entices potential readers while accurately reflecting the novel's essence.

  Here is the novel content:
  {{novelContent}}

  {% if existingSummaries %}
  Use these existing summaries as inspiration for tone and style:
  {{#each existingSummaries}}
  - {{this}}
  {{/each}}
  {% endif %}

  Please generate a concise, three-line summary that captures the core themes and intrigues readers.
  Ensure that the summary is accurate and does not reveal major plot spoilers.
  Summary:`, 
});

const summarizeNovelFlow = ai.defineFlow(
  {
    name: 'summarizeNovelFlow',
    inputSchema: SummarizeNovelInputSchema,
    outputSchema: SummarizeNovelOutputSchema,
  },
  async input => {
    const {output} = await summarizeNovelPrompt(input);
    return output!;
  }
);
