import NavBar from '@/components/layout/NavBar';
import AiToolCard from '@/components/simple/AiToolCard';
import DiscordIcon from '@/components/simple/icons/DiscordIcon';
import { Button } from '@/components/ui/button';
import sanity from '@/lib/sanity';
import { AiTool } from '@/types';
import { PortableText } from '@portabletext/react';
import {
  BookmarkIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExternalLinkIcon,
  FacebookIcon,
  LinkedinIcon,
  Star,
  VerifiedIcon,
} from 'lucide-react';
import { Loading, Notify } from 'notiflix';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AiToolPage = () => {
  const [tool, setTool] = useState<AiTool | undefined>(undefined);
  const [featuredTools, setFeaturedTools] = useState<AiTool[]>([]);
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();

  const fetchData = (slug: string) => {
    setLoading(true);
    Loading.hourglass();

    // Fetch AI tool data by slug
    sanity
      .fetch(
        `*[_type == "aiTool" && slug.current == '${slug}'][0] {
        "id": _id,
        name,
        title,
        categories[]->,
        pricingModel,
        description,
        stars,
        body,
        siteUrl,
        verified,
        featured,
        "slug": slug.current,
        "authorName": author->name,
        "authorBio": author->bio,
        "authorImageUrl": author->image.asset->url,
        ytVideoUrl,
        "imageUrl": mainImage.asset->url,
        "imageAlt": mainImage.alt,
        "createdAt": _createdAt,
        "updatedAt": _updatedAt
      }`
      )
      .then((responseData: AiTool) => {
        setTool(responseData);
      })
      .catch(() => {
        Notify.failure('Error fetching tool, please try again later');
      })
      .finally(() => {
        Loading.remove();
        setLoading(false);
      });

    // Fetch featured AI tools
    sanity
      .fetch(
        `*[_type == "aiTool" && featured == true][0..5] | order(createdAt) {
        "id": _id,
        name,
        title,
        categories[]->,
        pricingModel,
        description,
        stars,
        body,
        verified,
        siteUrl,
        featured,
        "slug": slug.current,
        "authorName": author->name,
        "authorBio": author->bio,
        "authorImageUrl": author->image.asset->url,
        ytVideoUrl,
        "imageUrl": mainImage.asset->url,
        "imageAlt": mainImage.alt,
        "createdAt": _createdAt,
        "updatedAt": _updatedAt
      }`
      )
      .then((responseData: AiTool[]) => {
        setFeaturedTools(responseData);
      })
      .catch(() => {
        Notify.failure('Error fetching featured tools, please try again later');
      });
  };

  useEffect(() => {
    if (loading) {
      return Loading.hourglass();
    }
    Loading.remove();
  }, [loading]);

  useEffect(() => {
    if (!slug) {
      navigate('/');
      return;
    }
    fetchData(slug);
  }, [slug, navigate]);

  const toTitleCase = (str: string) => {
    return str.toLowerCase().replace(/^(.)|\s(.)/g, function ($1) {
      return $1.toUpperCase();
    });
  };

  return (
    <div>
      <NavBar />

      <main className="min-h-dvh">
        {tool && !loading ? (
          <div className="pt-40 xl:pt-36 lg:p-16">
            <div className="grid gap-5 xl:grid-cols-2">
              <div className="flex flex-col justify-between">
                <div className="flex gap-4">
                  <img
                    src={tool.imageUrl}
                    className="h-24 w-24 min-h-0 min-w-0 bg-black bg-opacity-70"
                    alt={tool.name}
                  />
                  <div className="flex flex-col justify-center">
                    <p className="text-5xl font-bold">{tool.name}</p>
                    <p className="flex flex-wrap gap-1">
                      {[...Array(tool.stars)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      {tool.verified && (
                        <span className="inline-flex text-primary">
                          <VerifiedIcon className="fill-primary stroke-white" />
                          Verified
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <p className="text-3xl line-clamp-2 overflow-ellipsis">
                  {tool.description}
                </p>

                <div>
                  <p className="mt-2">
                    <span className="font-semibold">AI Categories: </span>
                    <span className="text-primary">
                      {tool.categories
                        .map((category) => toTitleCase(category.title))
                        .join(', ')}
                    </span>
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold">Pricing Model: </span>
                    {tool.pricingModel}
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold">Follow: </span>
                    <span className="inline-flex gap-2">
                      <a
                        href="https://www.facebook.com/groups/1490131391564053/?ref=share"
                        title="Visit our Facebook Page"
                      >
                        <FacebookIcon
                          className="stroke-primary fill-primary"
                          height="20"
                          width="20"
                        />
                      </a>
                      <a
                        href="https://www.linkedin.com/groups/9802179"
                        title="Visit our LinkedIn Account"
                      >
                        <LinkedinIcon
                          className="stroke-primary"
                          height="20"
                          width="20"
                        />
                      </a>
                      <a
                        href="https://discord.gg/zytPSazu6S"
                        title="Join our Discord Channel"
                      >
                        <DiscordIcon
                          className="stroke-primary fill-primary"
                          height={20}
                          width={20}
                        />
                      </a>
                    </span>
                  </p>
                </div>

                <div className="flex gap-5">
                  <Button className="flex gap-1 items-center border-2 border-primary text-primary hover:bg-slate-200 focus-visible:bg-slate-200 bg-white">
                    <BookmarkIcon />0
                  </Button>
                  <Button asChild>
                    <a className="flex gap-1 items-center" href={tool.siteUrl}>
                      Visit Site <ExternalLinkIcon />
                    </a>
                  </Button>
                </div>
              </div>

              <div>
                {tool.ytVideoUrl ? (
                  <iframe
                    src={tool.ytVideoUrl}
                    className="h-96 w-full"
                    title="Play video"
                  />
                ) : (
                  <img
                    src={tool.imageUrl}
                    className="h-96 w-full object-cover"
                    alt={tool.imageAlt}
                  />
                )}
              </div>
            </div>

            <div className="grid gap-10 xl:grid-cols-[65%_35%] mt-20">
              <div className="pr-10">
                <p className="flex gap-2 text-slate-500">
                  <CalendarIcon /> Updated{' '}
                  {new Date(tool.updatedAt).toLocaleDateString()}
                </p>
                <div className="mt-3 unreset">
                  <PortableText value={tool.body} />
                </div>
              </div>

              <div>
                {featuredTools.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold">Featured AI Tools</h2>
                    <div className="grid gap-5 mt-5">
                      {featuredTools.map((tool) => (
                        <AiToolCard key={tool.id} tool={tool} featured={true} />
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-10 rounded-xl p-5 bg-primary text-white">
                  <h2 className="text-3xl font-bold">
                    Become an AI expert of your office
                  </h2>
                  <h3 className="text-lg font-semibold">
                    Join 200 professionals adopting AI tools for work
                  </h3>

                  <ul className="flex flex-col gap-2 my-4">
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon />
                      Bookmark 100s of AI tools that interest you
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon />
                      Get personalized AI tool recommendations every week
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon />
                      Free weekly newsletter with practical news, trending
                      tools, tutorials and more
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
    </div>
  );
};

export default AiToolPage;
