type Film = {
    /**
     * Film id as defined by the database
     */
    id: number,

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
    release_date: Date,

    /**
     * Image filename as defined by the database
     */
    image_filename: string,

    /**
     * Runtime as defined by the database
     */
    runtime: number,

    /**
     * Director id as defined by the database
     */
    director_id: number,

    /**
     * Genre id as defined by the database
     */
    genre_id: number,

    /**
     * Age rating as defined by the database
     */
    age_rating: string;
}