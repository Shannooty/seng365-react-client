type Film = {
    /**
     * FilmComponents id as defined by the database
     */
    filmId: number,

    /**
     * Title as defined by the database
     */
    title: string,

    /**
     * Description as defined by the database
     */
    description: string,

    /**
     * Release date as defined by the database
     */
    releaseDate: string,


    /**
     * Director id as defined by the database
     */
    directorId: number,

    /**
     * First name of Director
     */
    directorFirstName: string,

    /**
     * Last name of director
     */
    directorLastName: string,



    /**
     * Genre id as defined by the database
     */
    genreId: number,

    /**
     * Age rating as defined by the database
     */
    ageRating: string;

    /**
     * Average user rating
     */
    rating: number;
}