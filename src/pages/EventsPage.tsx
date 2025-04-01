import NavBar from '@/components/layout/NavBar';
import EventCard from '@/components/simple/EventCard';
import sanity from '@/lib/sanity';
import { Event } from '@/types';
import { Loading, Notify } from 'notiflix';
import { useEffect, useState } from 'react';

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      Loading.hourglass();
      setLoading(true);

      try {
        const responseData =
          await sanity.fetch(`*[_type == "event"] | order(date desc) {
          title,
          description,
          linkToEvent,
          slug,
          "imageUrl": image.asset->url,
          location,
          date
        }`);
        setEvents(responseData);
      } catch (error) {
        console.error('An error occurred while trying to fetch events', error);
        Notify.failure('Error fetching events, please try again later');
      } finally {
        Loading.remove();
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <header>
        <NavBar />
      </header>

      <main className="min-h-dvh pt-[100px] lg:pt-[150px] px-5 pb-10">
        <h1 className="text-xl sm:text-3xl font-bold">Events</h1>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : events.length > 0 ? (
          <div className="mt-5 grid gap-5">
            {events.map((event) => (
              <EventCard key={event.title} event={event} />
            ))}
          </div>
        ) : (
          <div>
            <p className="text-center text-lg">
              No event found. Please check back later.
            </p>
          </div>
        )}
      </main>
    </>
  );
};

export default EventsPage;
