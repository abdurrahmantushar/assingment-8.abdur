
import {
  CalendarCheck,
  HandHeart,
  HeartHandshake,
  UsersRound,
  ArrowUpRight,
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
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#f9fcf8] to-white px-5 py-20 dark:from-[#101810] dark:via-[#121d14] dark:to-[#101810] sm:px-8 sm:py-24 lg:px-12">
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-green-200/20 blur-[100px] dark:bg-green-500/5" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-emerald-200/20 blur-[100px] dark:bg-emerald-500/5" />

      <div className="relative mx-auto max-w-[1600px]">
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200/80 bg-green-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-green-700 dark:border-green-800/50 dark:bg-green-500/10 dark:text-green-400">
            <HandHeart size={15} />
            Why Join Us
          </div>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-[42px]">
            Make Impact With{" "}
            <span className="text-green-700 dark:text-green-400">
              Our Platform
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base">
            Every small action creates a meaningful change. Discover how you
            can contribute, connect with others, and make a difference in your
            community.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {features.map(({ icon: Icon, title, description }, index) => (
            <div
              key={title}
              className="group relative flex min-h-[260px] flex-col items-center overflow-hidden rounded-2xl border border-gray-200/80 bg-white/90 px-6 py-8 text-center shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-green-300 hover:shadow-xl hover:shadow-green-900/10 dark:border-white/10 dark:bg-[#172117]/90 dark:hover:border-green-700/70 dark:hover:shadow-green-950/30"
            >
              <span className="absolute right-5 top-4 text-xs font-bold tracking-widest text-gray-200 transition-colors group-hover:text-green-200 dark:text-white/10 dark:group-hover:text-green-900">
                0{index + 1}
              </span>

              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-green-100/40 blur-2xl transition-all duration-500 group-hover:bg-green-200/60 dark:bg-green-500/5 dark:group-hover:bg-green-500/10" />

              <div className="relative mb-6 flex h-[68px] w-[68px] items-center justify-center rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-100 text-green-700 shadow-sm transition-all duration-500 group-hover:rotate-[-5deg] group-hover:scale-110 group-hover:shadow-md group-hover:shadow-green-900/10 dark:border-green-800/40 dark:from-green-500/10 dark:to-emerald-500/10 dark:text-green-400">
                <Icon size={30} strokeWidth={1.7} />
              </div>

              <h3 className="relative mb-3 text-base font-bold tracking-tight text-gray-900 transition-colors group-hover:text-green-700 dark:text-white dark:group-hover:text-green-400 sm:text-lg">
                {title}
              </h3>

              <p className="relative max-w-[260px] text-sm leading-7 text-gray-600 dark:text-gray-400">
                {description}
              </p>

              <div className="relative mt-auto flex w-full items-center justify-center pt-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-green-700 transition-all duration-300 group-hover:bg-green-700 group-hover:text-white dark:bg-green-500/10 dark:text-green-400 dark:group-hover:bg-green-500 dark:group-hover:text-white">
                  <ArrowUpRight
                    size={17}
                    className="transition-transform duration-300 group-hover:rotate-45"
                  />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
