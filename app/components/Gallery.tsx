import { useEffect, useState, useRef } from "react";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

type Image = {
  src: string;
  width: number;
  height: number;
};

export async function fetchPhotosApi(
  page: number,
  limit: number
): Promise<Image[]> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  }).toString();
  console.log(params);

  try {
    const response = await fetch(`/api/photos?${params}`, {
      cache: "no-cache",
    });
    if (!response.ok) throw new Error("Failed to fetch photos");

    const data: Image[] = await response.json();
    console.log("Fetched photos:", data);
    return data;
  } catch (error) {
    console.error("Error fetching photos:", error);
    throw error; // Rethrow the error for handling in the component
  }
}

export function Gallery() {
  const [photos, setPhotos] = useState<Image[]>([]);
  const observerRef = useRef(null); // Reference to the intersection observer
  const loadMoreRef = useRef(null); // Reference to the sentinel element
  const [page, setPage] = useState(1);
  const limit = 8;
console.log(photos)
  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      if (page <= 600) { // Ensure we stop fetching after page 7
        console.log("Fetching page:", page);
        try {
          const newPhotos = await fetchPhotosApi(page, limit);
          setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
        } catch (error) {
          console.error("Error fetching photos:", error);
        }
      }
    };

    fetchPhotos();
  }, [page]);
  

  useEffect(() => {
    // Initialize intersection observer
    // @ts-expect-error do it later
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0 } // Trigger when the sentinel is fully in view
    );

    if (loadMoreRef.current) {
        // @ts-expect-error do it later
      observerRef.current.observe(loadMoreRef.current); // Observe the sentinel element
    }

    // Cleanup observer on component unmount
    return () => {
      if (observerRef.current && loadMoreRef.current) {
         // @ts-expect-error do it later
        observerRef.current.unobserve(loadMoreRef.current);
      }
    };
  }, []);

  return (
    <>
      <RowsPhotoAlbum photos={photos} />

      {/* Sentinel element that triggers loadMore when it comes into view */}
      <div ref={loadMoreRef} style={{ height: "1px" }} />
    </>
  );
}
