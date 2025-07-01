import { createContext, useState } from "react";
import { mainMovieTypes, seasonMoviesTypes } from "../(tabs)/home";

/*export interface currentMovieTypes {
    videoUrl?: string;
    title?: string;
    avatar?: string;
    dateCreated?: string;
    season?: number | null;
    episode?: number | null;
}*/

export interface episodeTypes {
    id: number | null;
    title: string;
    date_created: string;
    time_created: string;
    videoUrl: string;
    episode: number | null;
    imageUrl: string;
}

interface contextTypes {
    selectedSeason: seasonMoviesTypes;
    setMovieData: (it: seasonMoviesTypes) => undefined;
    selectedEpisode: episodeTypes;
    setEpisodeData: (it: episodeTypes) => undefined;
    mainMovieSelected: mainMovieTypes;
    setMainMovieData: (it: mainMovieTypes) => undefined;
    movieType: string;
    setMovieType: (it: string) => undefined;
}

export const SelectedMovie = createContext<contextTypes>({
    selectedSeason: { id: 0, imageUrl: "", title: "", MSM_seasons: [] },
    setMovieData: (it: seasonMoviesTypes) => undefined,
    selectedEpisode: {
        id: null,
        title: "",
        date_created: "",
        time_created: "",
        videoUrl: "",
        episode: null,
        imageUrl: "",
    },
    setEpisodeData: (it: episodeTypes) => undefined,
    mainMovieSelected: {
        id: null,
        title: "",
        imageUrl: "",
        videoUrl: "",
        date_created: "",
        time_created: "",
        genres: "",
    },
    setMainMovieData: (it: mainMovieTypes) => undefined,
    movieType: "",
    setMovieType: (it: string) => undefined,
});

export default function SelectedMovieProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [selectedSeason, setSelectedSeason] = useState<seasonMoviesTypes>({
        id: 0,
        imageUrl: "",
        title: "",
        MSM_seasons: [],
    });
    const [selectedEpisode, setSelectedEpisode] = useState<episodeTypes>({
        id: null,
        title: "",
        date_created: "",
        time_created: "",
        videoUrl: "",
        episode: null,
        imageUrl: "",
    });
    const [mainMovieSelected, setMainMovieSelected] = useState<mainMovieTypes>({
        id: null,
        title: "",
        imageUrl: "",
        videoUrl: "",
        date_created: "",
        time_created: "",
        genres: "",
    });
    const [movieType, setIsMain] = useState<string>("");

    const setMovieData = (it: seasonMoviesTypes): undefined => {
        setSelectedSeason(() => it);
    };
    const setEpisodeData = (it: episodeTypes): undefined => {
        setSelectedEpisode(() => it);
    };
    const setMainMovieData = (it: mainMovieTypes): undefined => {
        setMainMovieSelected(() => it);
    };
    const setMovieType = (it: string): undefined => {
        setIsMain(() => it);
    };

    const value = {
        selectedSeason,
        setMovieData,
        selectedEpisode,
        setEpisodeData,
        mainMovieSelected,
        setMainMovieData,
        movieType,
        setMovieType,
    };

    return (
        <SelectedMovie.Provider value={value}>
            {children}
        </SelectedMovie.Provider>
    );
}
