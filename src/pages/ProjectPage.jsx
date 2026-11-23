import ContentPage from '../components/ContentPage.jsx';
import Sources from '../components/Sources.jsx';

const STEPS = [
  { title: 'Choose a model', text: 'Start with a simple sphere or a two-lobe brain.' },
  {
    title: 'Set the impact',
    text: 'Pick a preset or tune punch speed, guard and tissue properties.',
  },
  { title: 'Strike', text: 'Watch the shockwave travel through the tissue in slow motion.' },
  { title: 'Read the results', text: 'Compare peak force, strain and pressure in the statistics.' },
];

/** @param {{ title: string, children: import('react').ReactNode }} props */
function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export default function ProjectPage() {
  return (
    <ContentPage
      eyebrow="The project"
      title="What happens inside the head on impact?"
      lead="An interactive simulation of how a shockwave from a blow travels through brain tissue."
    >
      <Section title="Inspiration">
        <p>
          Placeholder: what motivated the project, e.g. head impacts in combat sports and how little
          of their effect on the brain is visible from the outside.
        </p>
      </Section>

      <Section title="Goal">
        <p>
          Placeholder: make the mechanics of brain injury visible and explorable for students and
          the public, while staying grounded in published biomechanics research.
        </p>
      </Section>

      <Section title="How it works">
        <ol className="grid gap-3 sm:grid-cols-2">
          {STEPS.map((step, i) => (
            <li key={step.title} className="rounded-xl border border-line bg-surface p-4">
              <span className="font-display text-sm font-semibold text-accent">0{i + 1}</span>
              <h3 className="mt-1 font-semibold text-fg">{step.title}</h3>
              <p className="mt-1 text-sm">{step.text}</p>
            </li>
          ))}
        </ol>
        <p>
          Under the hood, brain tissue is modeled as a viscoelastic material: a network of springs
          (elasticity) and dampers (viscosity), the Kelvin–Voigt model used in our first prototypes.
        </p>
      </Section>

      <Section title="Sources">
        <Sources />
      </Section>
    </ContentPage>
  );
}
