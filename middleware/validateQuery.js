const Joi = require('joi');
const { capitalizaFirstLetter } = require('../utils');
const { BadRequestError } = require('../errors');
const { CURSOR_FLAGS } = require('mongodb');

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

const paginationSchema = Joi.object({
    page: Joi.alternatives()
        .try(Joi.number().integer().min(0).empty(''))
        .default(0),
    per_page: Joi.alternatives()
        .try(Joi.number().integer().min(5).max(50).empty(''))
        .default(15),
    rel: Joi.string()
        .insensitive()
        .empty()
        .default(null)
        .valid('next', 'prev', 'first', 'last', null),
});

const middleware = function (request, response, next) {
    let { page, per_page, rel } = request.query;

    let validation;
    const newQueryObject = {};

    // pagination query params
    validation = paginationSchema.validate({ page, per_page, rel });
    if (validation.error)
        throw new BadRequestError(validation.error.details[0].message);

    Object.assign(newQueryObject, validation.value);
    request.query = newQueryObject;
    next();
};

module.exports = middleware;
