import sanity from '@/lib/sanity';
import { PortableText } from '@portabletext/react';
import { Loading, Notify } from 'notiflix';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import DiscordIcon from '@/components/simple/icons/DiscordIcon';
import { Button } from '@/components/ui/button';
import {
  BookmarkIcon,
  CalendarIcon,
  CheckCircleIcon,
  FacebookIcon,
  LinkedinIcon,
} from 'lucide-react';

import NavBar from '@/components/layout/NavBar';
import { Resource } from '@/types';

const ResourceComponent = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (slug: string) => {
    Loading.hourglass();
    setLoading(true);

    try {
      const responseData =
        await sanity.fetch(`*[_type == "resource" && slug.current == '${decodeURI(
          slug
        )}'][0] {
        "id": _id,
        title,
        "category": category->title,
        body,
        "slug": slug.current,
        "authorName": author->name,
        "authorBio": author->bio,
        "authorImageUrl": author->image.asset->url,
        "imageUrl": mainImage.asset->url,
        "imageAlt": mainImage.alt,
        "createdAt": _createdAt,
        "updatedAt": _updatedAt
      }`);
      setResource(responseData);
    } catch (error) {
      console.error('An error occurred while trying to fetch resource', error);
      Notify.failure('Error fetching resource, please try again later');
    } finally {
      Loading.remove();
      setLoading(false);
    }
  };

  const toTitleCase = (str: string) => {
    return str.toLowerCase().replace(/^(.)|\s(.)/g, ($1) => $1.toUpperCase());
  };

  useEffect(() => {
    if (!slug) {
      navigate('/');
      return;
    }

    fetchData(slug);
  }, [slug, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBar />

      <main className="min-h-dvh">
        {resource && !loading ? (
          <div className="pt-40 xl:pt-36 p-5 lg:p-16">
            <div className="grid gap-5 xl:grid-cols-2 items-center">
              <div className="flex flex-col justify-center gap-3">
                <p className="text-5xl font-bold">{resource.title}</p>

                <div>
                  <p>
                    <span className="font-semibold">Category: </span>
                    <span className="text-primary">
                      {toTitleCase(resource.category)}
                    </span>
                  </p>
                  <p className="mt-1">
                    <span className="font-semibold">Follow: </span>
                    <span className="inline-flex gap-2">
                      <a
                        href="https://www.facebook.com/groups/1490131391564053/?ref=share"
                        title="Visit our Facebook Page"
                      >
                        <p className="sr-only">Visit our Facebook Page</p>
                        <FacebookIcon
                          className="stroke-primary fill-primary"
                          height={20}
                          width={20}
                        />
                      </a>
                      <a
                        href="https://www.linkedin.com/groups/9802179"
                        title="Visit our LinkedIn Account"
                      >
                        <p className="sr-only">Visit our LinkedIn Account</p>
                        <LinkedinIcon
                          className="stroke-primary"
                          height={20}
                          width={20}
                        />
                      </a>
                      <a
                        href="https://discord.gg/zytPSazu6S"
                        title="Join our Discord Channel"
                      >
                        <p className="sr-only">Join our Discord Channel</p>
                        <DiscordIcon
                          className="stroke-primary fill-primary"
                          height={20}
                          width={20}
                        />
                      </a>
                    </span>
                  </p>
                </div>
                <Button className="w-fit flex border-2 border-primary text-primary hover:bg-slate-200 focus-visible:bg-slate-200 bg-white">
                  <BookmarkIcon /> 0
                </Button>
              </div>
              <img
                src={resource.imageUrl}
                className="h-96 w-full object-cover"
                alt={resource.imageAlt || ''}
              />
            </div>

            <div className="grid gap-10 xl:grid-cols-[65%_35%] mt-20">
              <div className="pr-10">
                <p className="flex gap-2 text-slate-500">
                  <CalendarIcon /> Updated{' '}
                  {new Date(resource.updatedAt).toLocaleDateString()}
                </p>
                <div className="mt-3 unreset">
                  <PortableText value={resource.body} />
                </div>
              </div>

              <div>
                <div className="mt-10 rounded-xl p-5 bg-primary text-white">
                  <h2 className="text-3xl font-bold">
                    Become an AI expert of your office
                  </h2>
                  <h3 className="text-lg font-semibold">
                    Join 200 professionals adopting AI tools for work
                  </h3>

                  <ul className="flex flex-col gap-2 my-4">
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon /> Bookmark 100s of AI tools that
                      interest you
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon /> Get personalized AI tool
                      recommendations every week
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon /> Free weekly newsletter with practical
                      news, trending tools, tutorials and more
                    </li>
                  </ul>

                  <button className="w-full font-semibold rounded-full text-primary bg-white p-3">
                    Subscribe for our premium
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-[inherit] grid content-center text-center">
            <h2 className="text-6xl font-bold pb-5">Resource not found</h2>
            <Button
              className="text-xl w-fit mx-auto"
              onClick={() => navigate('/')}
            >
              Go back to home
            </Button>
          </div>
        )}
      </main>
    </>
  );
};

export default ResourceComponent;
