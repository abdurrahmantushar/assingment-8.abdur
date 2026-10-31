
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  HeartHandshake,
  MapPin,
  Users,
  HandHeart,
} from "lucide-react";

const impactStats = [
  {
    icon: Users,
    value: "2,500+",
    label: "Active Volunteers",
  },
  {
    icon: Heart,
    value: "180+",
    label: "Community Events",
  },
  {
    icon: MapPin,
    value: "35+",
    label: "Local Communities",
  },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-green-300/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1600px] items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-secondary px-4 py-2">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs font-bold tracking-wide text-primary sm:text-sm">
              TOGETHER FOR A BETTER TOMORROW
            </span>
          </div>

          <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Small Acts,
            <br />
            <span className="text-primary">Big Impact.</span>
            <br />
            Change Lives Together.
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
            Be part of something meaningful. Discover local community events,
            connect with passionate volunteers, and make a real difference
            where it matters most.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/upcoming-events"
              className="group inline-flex items-center justify-center gap-3 rounded-xl bg-primary px-7 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-1 hover:bg-primary/90"
            >
              Explore Events
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-3 rounded-xl border border-border bg-card px-7 py-4 text-sm font-bold text-foreground transition hover:border-primary hover:text-primary"
            >
              <HeartHandshake size={19} />
              Become a Volunteer
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-border pt-8">
            {impactStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div key={stat.label}>
                  <div className="mb-2 flex items-center gap-2 text-primary">
                    <Icon size={17} />
                    <span className="text-lg font-extrabold text-foreground sm:text-2xl">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-xs leading-5 text-muted-foreground sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
          <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full border-[18px] border-primary/10 sm:-right-8 sm:-top-8" />

          <div className="relative overflow-hidden rounded-[2rem] bg-secondary p-3 shadow-2xl shadow-primary/10 sm:p-4">
            <div
              role="img"
              aria-label="Volunteers working together in a community service activity"
              className="relative min-h-[380px] overflow-hidden rounded-[1.5rem] bg-cover bg-center sm:min-h-[480px]"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=85')",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/5" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-2 text-xs font-semibold backdrop-blur-md">
                  <HandHeart size={15} />
                  Make an Impact Today
                </span>

                <h2 className="mt-4 max-w-sm text-2xl font-bold leading-tight sm:text-3xl">
                  Together, we can make the world a better place.
                </h2>

                <Link
                  href="/upcoming-events"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white hover:underline"
                >
                  Find your next event
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-3 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-xl sm:-left-8 sm:p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
              <HeartHandshake size={26} />
            </div>

            <div>
              <p className="text-lg font-extrabold text-foreground">
                Be the Change
              </p>
              <p className="text-xs text-muted-foreground">
                Every little action matters
              </p>
            </div>
          </div>

          <div className="absolute -right-2 top-12 rounded-2xl border border-border bg-card px-4 py-3 shadow-lg sm:-right-6">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-secondary text-primary"
                  >
                    <Users size={14} />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">
                  Join Our Community
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Make a difference
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
