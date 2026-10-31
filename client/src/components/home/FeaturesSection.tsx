import {
  CalendarCheck,
  HandHeart,
  HeartHandshake,
  UsersRound,
} from "lucide-react";

const features = [
  {
    icon: CalendarCheck,
    title: "Create Events",
    description:
      "Organize social events and bring your community together for a good cause.",
  },
  {
    icon: UsersRound,
    title: "Join & Participate",
    description:
      "Join events that inspire you and contribute to meaningful social change.",
  },
  {
    icon: HandHeart,
    title: "Track Your Impact",
    description:
      "Keep track of your participation and see the positive impact you're creating.",
  },
  {
    icon: HeartHandshake,
    title: "Build Community",
    description:
      "Connect with like-minded people and build a stronger, compassionate community.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-white px-5 py-10 dark:bg-[#101810] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-7 text-center">
          <div className="mb-2 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-400">
            <HandHeart size={14} />
            Why Join Us
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            Make Impact With Our Platform
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white px-5 py-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg hover:shadow-green-900/5 dark:border-white/10 dark:bg-[#172117] dark:hover:border-green-800"
            >
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f7ed] text-green-700 transition-colors group-hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 dark:group-hover:bg-green-500/20">
                <Icon size={27} strokeWidth={1.8} />
              </div>

              <h3 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">
                {title}
              </h3>

              <p className="max-w-[220px] text-xs leading-5 text-gray-600 dark:text-gray-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}