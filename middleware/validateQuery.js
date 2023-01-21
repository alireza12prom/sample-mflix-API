const Joi = require('joi');
const { capitalizaFirstLetter } = require('../utils');
const { BadRequestError } = require('../errors');

const validLanguages = {
    EN: 'English',
    FRN: 'French',
    SPN: 'Spanish',
    Fin: 'Finnish',
    JPN: 'Japanese',
    ITN: 'Italian',
    GER: 'German',
    ARZ: 'Arabic',
    NOR: 'Norwegian',
    HIN: 'Hindi',
    YI: 'Yaddish',
    RUS: 'Russian',
    SRP: 'Serbian',
    POR: 'Portuguese',
    KOR: 'Korean',
    CHI: 'Chinese',
    HRV: 'Croatian',
    BAQ: 'Basque',
    THA: 'Thai',
    SWE: 'Swedish',
    DUT: 'Dutch',
    GEO: 'Georgian',
    GRE: 'Greek',
    AZE: 'Azerbaijani',
    HEB: 'Hebrew',
    POL: 'Polish',
    MDR: 'Mandarin',
};

const validGenres = [
    'Drama',
    'Comedy',
    'Biography',
    'Romance',
    'Mystery',
    'Music',
    'Crime',
    'Thriller',
    'Sci-Fi',
    'Family',
    'Adventure',
    'Action',
    'Documentary',
    'Short',
    'Western',
    'Horror',
    'News',
    'Musical',
    'War',
    'Animation',
];

const validCountries = {
    USA: 'USA',
    FRA: 'France',
    UK: 'UK',
    ITA: 'Italy',
    DEU: 'Germany',
    AUS: 'Australia',
    CHN: 'China',
    THA: 'Thailand',
    CAN: 'Canada',
    LUX: 'Luxembourg',
    IND: 'India',
    IRL: 'Ireland',
    JPN: 'Japan',
    HKG: 'Hong Kong',
    PAN: 'Panama',
    SWE: 'Sweden',
    ISL: 'Iceland',
    PRT: 'Portugal',
    SGP: 'Singapore',
    SVN: 'Slovenia',
    VNM: 'Vietnam',
    BEL: 'Belgium',
    RUS: 'Russia',
    NZL: 'New Zealand',
    AUT: 'Austria',
    DNK: 'Denmark',
    NLD: 'Netherlands',
};

const validTypes = ['movie', 'series'];

const QuerySchema = Joi.object({
    languages: Joi.string()
        .trim()
        .uppercase()
        .valid(...Object.getOwnPropertyNames(validLanguages)),

    genres: Joi.array().items(Joi.string().valid(...validGenres)),

    year: Joi.number()
        .integer()
        .min(1917)
        .message('Year must be greater thant 1917')
        .max(new Date().getFullYear())
        .message(`Year must be less than ${new Date().getFullYear()}`),

    countries: Joi.array().items(
        Joi.string().valid(...Object.getOwnPropertyNames(validCountries))
    ),

    type: Joi.string()
        .trim()
        .lowercase()
        .valid(...validTypes),

    directors: Joi.string().trim().min(1).max(34),

    query: Joi.string().trim().min(1).max(34),
});

const middleware = function (request, response, next) {
    let { p, lan, gen, year, countries, type, dir, q } = request.query;

    request.query.p = parseInt(p) ? parseInt(p) : 0;

    let QueryObject = {};
    if (lan) QueryObject.languages = lan;
    if (gen)
        QueryObject.genres = gen
            .split(',')
            .map((g) => capitalizaFirstLetter(g.trim()));
    if (year) QueryObject.year = parseInt(year);
    if (countries)
        QueryObject.countries = countries
            .split(',')
            .map((v) => v.trim().toUpperCase());
    if (type) QueryObject.type = type;
    if (dir) QueryObject.directors = dir;
    if (q) QueryObject.query = q;

    // validate queries
    const { error, value } = QuerySchema.validate(QueryObject);
    if (error) {
        throw new BadRequestError(error.details[0].message);
    }

    let FilterObject = {};
    const validQueries = Object.getOwnPropertyNames(value);
    if (validQueries.includes('languages')) {
        FilterObject.languages = validLanguages[value.languages];
    }

    if (validQueries.includes('genres')) {
        FilterObject.genres = { $all: value.genres };
    }

    if (validQueries.includes('countries')) {
        FilterObject.countries = {
            $all: value.countries.map((v) => validCountries[v]),
        };
    }

    if (validQueries.includes('type')) {
        FilterObject.type = value.type;
    }

    if (validQueries.includes('directors')) {
        FilterObject.directors = new RegExp(value.directors, 'i');
    }

    if (validQueries.includes('query')) {
        FilterObject.$text = { $search: `"${value.query}"` };
    }

    request.Filters = FilterObject;
    next();
};

module.exports = middleware;
