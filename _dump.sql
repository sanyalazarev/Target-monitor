SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE TABLE `clicks` (
  `id` int(11) NOT NULL,
  `affiliateId` int(11) NOT NULL,
  `offerId` int(11) NOT NULL,
  `creativeId` int(11) NOT NULL,
  `subAffiliateId` int(11) NOT NULL,
  `personId` int(11) NOT NULL,
  `ip` varchar(20) NOT NULL,
  `language` varchar(500) NOT NULL,
  `countryId` int(11) NOT NULL,
  `country` varchar(100) NOT NULL,
  `countryAllowed` tinyint(1) NOT NULL,
  `a1` varchar(1000) NOT NULL,
  `a2` varchar(1000) NOT NULL,
  `a3` varchar(1000) NOT NULL,
  `a4` varchar(1000) NOT NULL,
  `a5` varchar(1000) NOT NULL,
  `custom_params` varchar(3000) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `conversions` (
  `id` int(11) NOT NULL,
  `advertiserId` int(11) NOT NULL,
  `clickId` int(11) NOT NULL,
  `eventId` int(11) NOT NULL,
  `reward` float(8,2) NOT NULL DEFAULT '0.00',
  `b1` varchar(1000) NOT NULL,
  `b2` varchar(1000) NOT NULL,
  `b3` varchar(1000) NOT NULL,
  `b4` varchar(1000) NOT NULL,
  `b5` varchar(1000) NOT NULL,
  `age` tinyint(4) NOT NULL DEFAULT '0',
  `gender` tinyint(4) NOT NULL DEFAULT '0',
  `payout` float(7,2) NOT NULL,
  `comment` varchar(100) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `countries` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `iso` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `countries` (`id`, `name`, `iso`) VALUES
(1, 'Afghanistan', 'AF'),
(2, 'Albania', 'AL'),
(3, 'Algeria', 'DZ'),
(4, 'Andorra', 'AD'),
(5, 'Angola', 'AO'),
(6, 'Antigua and Barbuda', 'AG'),
(7, 'Argentina', 'AR'),
(8, 'Armenia', 'AM'),
(9, 'Australia', 'AU'),
(10, 'Austria', 'AT'),
(11, 'Azerbaijan', 'AZ'),
(12, 'Bahamas', 'BS'),
(13, 'Bahrain', 'BH'),
(14, 'Bangladesh', 'BD'),
(15, 'Barbados', 'BB'),
(16, 'Belarus', 'BY'),
(17, 'Belgium', 'BE'),
(18, 'Belize', 'BZ'),
(19, 'Benin', 'BJ'),
(20, 'Bhutan', 'BT'),
(21, 'Bolivia', 'BO'),
(22, 'Bosnia and Herzegovina', 'BA'),
(23, 'Botswana', 'BW'),
(24, 'Brazil', 'BR'),
(25, 'Brunei', 'BN'),
(26, 'Bulgaria', 'BG'),
(27, 'Burkina Faso', 'BF'),
(28, 'Burundi', 'BI'),
(29, 'Cabo Verde', ''),
(30, 'Cambodia', 'KH'),
(31, 'Cameroon', 'CM'),
(32, 'Canada', 'CA'),
(33, 'Central African Republic (CAR)', 'CF'),
(34, 'Chad', 'TD'),
(35, 'Chile', 'CL'),
(36, 'China', 'CN'),
(37, 'Colombia', 'CO'),
(38, 'Comoros', 'KM'),
(39, 'Democratic Republic of the Congo', 'CG'),
(40, 'Republic of the Congo', 'CG'),
(41, 'Costa Rica', 'CR'),
(42, 'Cote d\'Ivoire', 'CI'),
(43, 'Croatia', 'HR'),
(44, 'Cuba', 'CU'),
(45, 'Cyprus', 'CY'),
(46, 'Czech Republic', 'CZ'),
(47, 'Denmark', 'DK'),
(48, 'Djibouti', 'DJ'),
(49, 'Dominica', 'DM'),
(50, 'Dominican Republic', 'DO'),
(51, 'Ecuador', 'EC'),
(52, 'Egypt', 'EG'),
(53, 'El Salvador', 'SV'),
(54, 'Equatorial Guinea', 'GQ'),
(55, 'Eritrea', 'ER'),
(56, 'Estonia', 'EE'),
(57, 'Ethiopia', 'ET'),
(58, 'Fiji', 'FJ'),
(59, 'Finland', 'FI'),
(60, 'France', 'FR'),
(61, 'Gabon', 'GA'),
(62, 'Gambia', 'GM'),
(63, 'Georgia', 'GE'),
(64, 'Germany', 'DE'),
(65, 'Ghana', 'GH'),
(66, 'Greece', 'GR'),
(67, 'Grenada', 'GD'),
(68, 'Guatemala', 'GT'),
(69, 'Guinea', 'GN'),
(70, 'Guinea-Bissau', 'GW'),
(71, 'Guyana', 'GY'),
(72, 'Haiti', 'HT'),
(73, 'Honduras', 'HN'),
(74, 'Hungary', 'HU'),
(75, 'Iceland', 'IS'),
(76, 'India', 'IN'),
(77, 'Indonesia', 'ID'),
(78, 'Iran', 'IR'),
(79, 'Iraq', 'IQ'),
(80, 'Ireland', 'IE'),
(81, 'Israel', 'IL'),
(82, 'Italy', 'IT'),
(83, 'Jamaica', 'JM'),
(84, 'Japan', 'JP'),
(85, 'Jordan', 'JO'),
(86, 'Kazakhstan', 'KZ'),
(87, 'Kenya', 'KE'),
(88, 'Kiribati', 'KI'),
(89, 'Kosovo', ''),
(90, 'Kuwait', 'KW'),
(91, 'Kyrgyzstan', 'KG'),
(92, 'Laos', ''),
(93, 'Latvia', 'LV'),
(94, 'Lebanon', 'LB'),
(95, 'Lesotho', 'LS'),
(96, 'Liberia', 'LR'),
(97, 'Libya', 'LY'),
(98, 'Liechtenstein', 'LI'),
(99, 'Lithuania', 'LT'),
(100, 'Luxembourg', 'LU'),
(101, 'Macedonia', 'MK'),
(102, 'Madagascar', 'MG'),
(103, 'Malawi', 'MW'),
(104, 'Malaysia', 'MY'),
(105, 'Maldives', 'MV'),
(106, 'Mali', 'ML'),
(107, 'Malta', 'MT'),
(108, 'Marshall Islands', 'MH'),
(109, 'Mauritania', 'MR'),
(110, 'Mauritius', 'MU'),
(111, 'Mexico', 'MX'),
(112, 'Micronesia', 'FM'),
(113, 'Moldova', 'MD'),
(114, 'Monaco', 'MC'),
(115, 'Mongolia', 'MN'),
(116, 'Montenegro', 'ME'),
(117, 'Morocco', 'MA'),
(118, 'Mozambique', 'MZ'),
(119, 'Myanmar (Burma)', 'MM'),
(120, 'Namibia', 'NA'),
(121, 'Nauru', 'NR'),
(122, 'Nepal', 'NP'),
(123, 'Netherlands', 'NL'),
(124, 'New Zealand', 'NZ'),
(125, 'Nicaragua', 'NI'),
(126, 'Niger', 'NE'),
(127, 'Nigeria', 'NG'),
(128, 'North Korea', 'KP'),
(129, 'Norway', 'NO'),
(130, 'Oman', 'OM'),
(131, 'Pakistan', 'PK'),
(132, 'Palau', 'PW'),
(133, 'Palestine', ''),
(134, 'Panama', 'PA'),
(135, 'Papua New Guinea', 'PG'),
(136, 'Paraguay', 'PY'),
(137, 'Peru', 'PE'),
(138, 'Philippines', 'PH'),
(139, 'Poland', 'PL'),
(140, 'Portugal', 'PT'),
(141, 'Qatar', 'QA'),
(142, 'Romania', 'RO'),
(143, 'Russia', 'RU'),
(144, 'Rwanda', 'RW'),
(145, 'Saint Kitts and Nevis', 'KN'),
(146, 'Saint Lucia', 'LC'),
(147, 'Saint Vincent and the Grenadines', ''),
(148, 'Samoa', 'WS'),
(149, 'San Marino', 'SM'),
(150, 'Sao Tome and Principe', 'ST'),
(151, 'Saudi Arabia', 'SA'),
(152, 'Senegal', 'SN'),
(153, 'Serbia', 'RS'),
(154, 'Seychelles', 'SC'),
(155, 'Sierra Leone', 'SL'),
(156, 'Singapore', 'SG'),
(157, 'Slovakia', 'SK'),
(158, 'Slovenia', 'SI'),
(159, 'Solomon Islands', 'SB'),
(160, 'Somalia', 'SO'),
(161, 'South Africa', 'ZA'),
(162, 'South Korea', 'KR'),
(163, 'South Sudan', 'SS'),
(164, 'Spain', 'ES'),
(165, 'Sri Lanka', 'LK'),
(166, 'Sudan', 'SD'),
(167, 'Suriname', 'SR'),
(168, 'Swaziland', 'SZ'),
(169, 'Sweden', 'SE'),
(170, 'Switzerland', 'CH'),
(171, 'Syria', 'SY'),
(172, 'Taiwan', 'TW'),
(173, 'Tajikistan', 'TJ'),
(174, 'Tanzania', 'TZ'),
(175, 'Thailand', 'TH'),
(176, 'Timor-Leste', 'TL'),
(177, 'Togo', 'TG'),
(178, 'Tonga', 'TO'),
(179, 'Trinidad and Tobago', 'TT'),
(180, 'Tunisia', 'TN'),
(181, 'Turkey', 'TR'),
(182, 'Turkmenistan', 'TM'),
(183, 'Tuvalu', 'TV'),
(184, 'Uganda', 'UG'),
(185, 'Ukraine', 'UA'),
(188, 'United States of America', 'US'),
(189, 'Uruguay', 'UY'),
(190, 'Uzbekistan', 'UZ'),
(191, 'Vanuatu', 'VU'),
(192, 'Vatican City (Holy See)', 'VA'),
(193, 'Venezuela', 'VE'),
(194, 'Vietnam', 'VN'),
(195, 'Yemen', 'YE'),
(196, 'Zambia', 'ZM'),
(197, 'Zimbabwe', 'ZW'),
(198, 'Puerto Rico', ''),
(199, 'Jersey', ''),
(200, 'Korea, Republic of', ''),
(201, 'United Arab Emirates', 'AE'),
(202, 'United Kingdom of Great Britain and Northern Ireland', ''),
(203, 'Viet Nam', ''),
(205, 'Hong Kong', ''),
(206, 'Iran (Islamic Republic of)', ''),
(207, 'Czechia', ''),
(208, 'Russian Federation', ''),
(209, 'Venezuela (Bolivarian Republic of)', ''),
(210, 'Lao People\'s Democratic Republic', ''),
(211, 'Unknown', ''),
(212, 'Taiwan, Province of China', ''),
(213, 'Bolivia (Plurinational State of)', ''),
(214, 'Virgin Islands (British)', ''),
(215, 'Palestine, State of', ''),
(216, 'Guam', ''),
(217, 'Macao', ''),
(218, 'Congo', ''),
(219, 'Eswatini', ''),
(220, 'North Macedonia', ''),
(221, 'Syrian Arab Republic', ''),
(222, 'Moldova, Republic of', ''),
(223, 'Greenland', ''),
(224, 'Myanmar', ''),
(225, 'Bermuda', ''),
(226, 'Guadeloupe', ''),
(227, 'Tanzania, United Republic of', ''),
(228, 'Congo, Democratic Republic of the', ''),
(229, 'Brunei Darussalam', ''),
(230, 'New Caledonia', ''),
(231, 'Réunion', ''),
(232, 'Aruba', ''),
(233, 'Faroe Islands', ''),
(234, 'Gibraltar', ''),
(235, 'Isle of Man', ''),
(236, 'Northern Mariana Islands', ''),
(237, 'Cayman Islands', ''),
(238, 'Curaçao', ''),
(239, 'Virgin Islands (U.S.)', ''),
(240, 'French Polynesia', ''),
(241, 'Guernsey', '');

CREATE TABLE `creatives` (
  `id` int(11) NOT NULL,
  `affiliateId` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `advertiserId` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `regular` tinyint(1) NOT NULL DEFAULT '0',
  `price` float(8,2) NOT NULL,
  `percent` float(5,2) NOT NULL,
  `public` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `offers` (
  `id` int(11) NOT NULL,
  `advertiserId` int(11) NOT NULL,
  `domainId` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(300) NOT NULL,
  `url` varchar(300) NOT NULL,
  `public` tinyint(1) NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `offers_affiliates` (
  `id` int(11) NOT NULL,
  `offerId` int(11) NOT NULL,
  `affiliateId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `offers_events` (
  `id` int(11) NOT NULL,
  `eventId` int(11) NOT NULL,
  `affiliateId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `offers_permitted_countries` (
  `id` int(11) NOT NULL,
  `offerId` int(11) NOT NULL,
  `countryId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `offers_pricing` (
  `id` int(11) NOT NULL,
  `offerId` int(11) NOT NULL,
  `countryId` int(11) NOT NULL,
  `gender` tinyint(1) NOT NULL,
  `ageFrom` tinyint(4) NOT NULL,
  `ageTo` tinyint(4) NOT NULL,
  `price` float(8,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `persons` (
  `id` int(11) NOT NULL,
  `age` tinyint(3) NOT NULL,
  `gender` varchar(100) NOT NULL,
  `device` varchar(500) NOT NULL,
  `language` varchar(300) NOT NULL,
  `fingerprint` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `postbacks` (
  `id` int(11) NOT NULL,
  `affiliateId` int(11) NOT NULL,
  `eventId` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `url` varchar(300) NOT NULL,
  `method` varchar(5) NOT NULL,
  `query` varchar(500) NOT NULL,
  `dailyLimit` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `postbacks_log` (
  `id` int(11) NOT NULL,
  `url` varchar(300) NOT NULL,
  `query` varchar(500) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `subaffiliates` (
  `id` int(11) NOT NULL,
  `affiliateId` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `utmId` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `tracking_domains` (
  `id` int(11) NOT NULL,
  `advertiserId` int(11) NOT NULL,
  `domain` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `image` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `role` tinyint(4) NOT NULL DEFAULT '10' COMMENT '10 - client, 100 - admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `users` (`id`, `email`, `password`, `image`, `name`, `phone`, `role`) VALUES
(1, 'admin@gmail.com', '$2b$10$IVda3uPNfLz2R2PUYhvimuKxM/MAHS1cskDXlixGWGCQa4ohjH0Le', '', 'Admin', '', 100);


ALTER TABLE `clicks`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `conversions`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `creatives`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `offers`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `offers_affiliates`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `offers_events`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `offers_permitted_countries`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `offers_pricing`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `persons`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `postbacks`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `postbacks_log`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `subaffiliates`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `tracking_domains`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `clicks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT;

ALTER TABLE `conversions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT;

ALTER TABLE `countries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=242;

ALTER TABLE `creatives`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT;

ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT;

ALTER TABLE `offers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT;

ALTER TABLE `offers_affiliates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `offers_events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `offers_permitted_countries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT;

ALTER TABLE `offers_pricing`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT;

ALTER TABLE `persons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT;

ALTER TABLE `postbacks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT;

ALTER TABLE `postbacks_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT;

ALTER TABLE `subaffiliates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT;

ALTER TABLE `tracking_domains`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;