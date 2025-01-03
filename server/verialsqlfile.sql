--
-- PostgreSQL database dump
--

-- Dumped from database version 14.15 (Homebrew)
-- Dumped by pg_dump version 14.15 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: ikram
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO ikram;

--
-- Name: update_users_updated_at(); Type: FUNCTION; Schema: public; Owner: ikram
--

CREATE FUNCTION public.update_users_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_users_updated_at() OWNER TO ikram;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: articles; Type: TABLE; Schema: public; Owner: ikram
--

CREATE TABLE public.articles (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    sales integer DEFAULT 0,
    last_sold date,
    product character varying(255),
    stock_level integer NOT NULL,
    brand character varying(255) NOT NULL,
    dimensions character varying(100),
    description text,
    purchase_price numeric(10,2) DEFAULT 0.00,
    sale_price numeric(10,2) DEFAULT 0.00,
    profit_margin numeric(5,2) GENERATED ALWAYS AS ((((sale_price - purchase_price) / purchase_price) * (100)::numeric)) STORED,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    provider_id integer,
    used integer DEFAULT 0,
    low_stock integer DEFAULT 0,
    revenue numeric(10,2),
    CONSTRAINT articles_stock_level_check CHECK ((stock_level >= 0)),
    CONSTRAINT check_purchase_price_nonzero CHECK ((purchase_price > (0)::numeric))
);


ALTER TABLE public.articles OWNER TO ikram;

--
-- Name: articles_id_seq; Type: SEQUENCE; Schema: public; Owner: ikram
--

CREATE SEQUENCE public.articles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.articles_id_seq OWNER TO ikram;

--
-- Name: articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ikram
--

ALTER SEQUENCE public.articles_id_seq OWNED BY public.articles.id;


--
-- Name: charges; Type: TABLE; Schema: public; Owner: ikram
--

CREATE TABLE public.charges (
    id integer NOT NULL,
    charge_type character varying(50) NOT NULL,
    provider_client character varying(100) NOT NULL,
    invoice_number character varying(50) NOT NULL,
    payment_method character varying(50) NOT NULL,
    charge_date date NOT NULL,
    amount numeric(12,2) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.charges OWNER TO ikram;

--
-- Name: charges_id_seq; Type: SEQUENCE; Schema: public; Owner: ikram
--

CREATE SEQUENCE public.charges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.charges_id_seq OWNER TO ikram;

--
-- Name: charges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ikram
--

ALTER SEQUENCE public.charges_id_seq OWNED BY public.charges.id;


--
-- Name: client_documents; Type: TABLE; Schema: public; Owner: ikram
--

CREATE TABLE public.client_documents (
    id integer NOT NULL,
    invoice_number integer NOT NULL,
    client_name character varying(255) NOT NULL,
    invoice_date date NOT NULL,
    invoice_type character varying(50),
    company_name character varying(255) NOT NULL,
    company_address character varying(255),
    company_registration_number character varying(50),
    subtotal numeric(10,2) NOT NULL,
    tva_percentage numeric(5,2) NOT NULL,
    tva_value numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL,
    comments text
);


ALTER TABLE public.client_documents OWNER TO ikram;

--
-- Name: client_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: ikram
--

CREATE SEQUENCE public.client_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.client_documents_id_seq OWNER TO ikram;

--
-- Name: client_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ikram
--

ALTER SEQUENCE public.client_documents_id_seq OWNED BY public.client_documents.id;


--
-- Name: invoice_number_seq; Type: SEQUENCE; Schema: public; Owner: ikram
--

CREATE SEQUENCE public.invoice_number_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999
    CACHE 1;


ALTER TABLE public.invoice_number_seq OWNER TO ikram;

--
-- Name: client_invoices; Type: TABLE; Schema: public; Owner: ikram
--

CREATE TABLE public.client_invoices (
    id integer NOT NULL,
    invoice_id integer,
    reference_number character varying(50),
    description text,
    total_price numeric NOT NULL,
    client_name character varying(255),
    invoice_type character varying(255),
    items jsonb,
    date_of_purchase date DEFAULT CURRENT_DATE,
    tva_percentage numeric,
    comment text,
    initial_price numeric(10,2),
    tva_percentage_1 numeric(5,2),
    tva_percentage_2 numeric(5,2),
    invoice_number character varying(255) DEFAULT nextval('public.invoice_number_seq'::regclass) NOT NULL
);


ALTER TABLE public.client_invoices OWNER TO ikram;

--
-- Name: client_invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: ikram
--

CREATE SEQUENCE public.client_invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.client_invoices_id_seq OWNER TO ikram;

--
-- Name: client_invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ikram
--

ALTER SEQUENCE public.client_invoices_id_seq OWNED BY public.client_invoices.id;


--
-- Name: client_invoices_invoice_number_seq; Type: SEQUENCE; Schema: public; Owner: ikram
--

CREATE SEQUENCE public.client_invoices_invoice_number_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.client_invoices_invoice_number_seq OWNER TO ikram;

--
-- Name: client_invoices_invoice_number_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ikram
--

ALTER SEQUENCE public.client_invoices_invoice_number_seq OWNED BY public.client_invoices.invoice_number;


--
-- Name: clients; Type: TABLE; Schema: public; Owner: ikram
--

CREATE TABLE public.clients (
    id integer NOT NULL,
    company_name character varying(255) NOT NULL,
    nif character varying(50) NOT NULL,
    client_name character varying(255) NOT NULL,
    client_type character varying(50),
    phone1 character varying(20),
    phone2 character varying(20),
    phone3 character varying(20),
    iceo character varying(100),
    country character varying(100),
    province character varying(100),
    postal_code character varying(20),
    email1 character varying(100),
    email2 character varying(100),
    email3 character varying(100)
);


ALTER TABLE public.clients OWNER TO ikram;

--
-- Name: clients_id_seq; Type: SEQUENCE; Schema: public; Owner: ikram
--

CREATE SEQUENCE public.clients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.clients_id_seq OWNER TO ikram;

--
-- Name: clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ikram
--

ALTER SEQUENCE public.clients_id_seq OWNED BY public.clients.id;


--
-- Name: finance; Type: TABLE; Schema: public; Owner: ikram
--

CREATE TABLE public.finance (
    id integer NOT NULL,
    revenue numeric(15,2),
    expenses numeric(15,2),
    profit numeric(15,2),
    date date DEFAULT CURRENT_DATE NOT NULL,
    outstanding numeric,
    paid numeric,
    month character varying(20),
    due_date date,
    due_invoices integer
);


ALTER TABLE public.finance OWNER TO ikram;

--
-- Name: finance_id_seq; Type: SEQUENCE; Schema: public; Owner: ikram
--

CREATE SEQUENCE public.finance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.finance_id_seq OWNER TO ikram;

--
-- Name: finance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ikram
--

ALTER SEQUENCE public.finance_id_seq OWNED BY public.finance.id;


--
-- Name: financial_snapshot; Type: TABLE; Schema: public; Owner: ikram
--

CREATE TABLE public.financial_snapshot (
    id integer NOT NULL,
    total_revenue numeric(15,2) NOT NULL,
    total_expenses numeric(15,2) NOT NULL,
    net_profit numeric(15,2) NOT NULL,
    report_date date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.financial_snapshot OWNER TO ikram;

--
-- Name: financial_snapshot_id_seq; Type: SEQUENCE; Schema: public; Owner: ikram
--

CREATE SEQUENCE public.financial_snapshot_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.financial_snapshot_id_seq OWNER TO ikram;

--
-- Name: financial_snapshot_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ikram
--

ALTER SEQUENCE public.financial_snapshot_id_seq OWNED BY public.financial_snapshot.id;


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: ikram
--

CREATE TABLE public.invoices (
    id integer NOT NULL,
    client_name text NOT NULL,
    date_of_purchase date NOT NULL,
    total_price numeric NOT NULL
);


ALTER TABLE public.invoices OWNER TO ikram;

--
-- Name: invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: ikram
--

CREATE SEQUENCE public.invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.invoices_id_seq OWNER TO ikram;

--
-- Name: invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ikram
--

ALTER SEQUENCE public.invoices_id_seq OWNED BY public.invoices.id;


--
-- Name: made_bills; Type: TABLE; Schema: public; Owner: ikram
--

CREATE TABLE public.made_bills (
    id character varying(10) NOT NULL,
    provider character varying(255) NOT NULL,
    amount numeric(10,2) NOT NULL,
    method character varying(50) NOT NULL,
    date date NOT NULL,
    status character varying(20) NOT NULL
);


ALTER TABLE public.made_bills OWNER TO ikram;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: ikram
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    payer character varying(255) NOT NULL,
    amount numeric(10,2) NOT NULL,
    method character varying(50) NOT NULL,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payments_status_check CHECK (((status)::text = ANY ((ARRAY['Paid'::character varying, 'Pending'::character varying])::text[])))
);


ALTER TABLE public.payments OWNER TO ikram;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: ikram
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payments_id_seq OWNER TO ikram;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ikram
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: provider_documents; Type: TABLE; Schema: public; Owner: ikram
--

CREATE TABLE public.provider_documents (
    id integer NOT NULL,
    invoice_number character varying(50) NOT NULL,
    provider_name character varying(100) NOT NULL,
    invoice_type character varying(50) NOT NULL,
    date date NOT NULL,
    total_price_with_tva numeric(12,2) NOT NULL
);


ALTER TABLE public.provider_documents OWNER TO ikram;

--
-- Name: provider_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: ikram
--

CREATE SEQUENCE public.provider_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.provider_documents_id_seq OWNER TO ikram;

--
-- Name: provider_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ikram
--

ALTER SEQUENCE public.provider_documents_id_seq OWNED BY public.provider_documents.id;


--
-- Name: providers; Type: TABLE; Schema: public; Owner: ikram
--

CREATE TABLE public.providers (
    id integer NOT NULL,
    name character varying(100) DEFAULT 'Unknown'::character varying NOT NULL,
    orders integer NOT NULL,
    pending integer NOT NULL,
    value numeric(15,2) NOT NULL,
    label character varying(50) DEFAULT 'Unknown'::character varying NOT NULL,
    color character varying(20) DEFAULT 'hsl(0, 0%, 50%)'::character varying NOT NULL,
    email character varying(255),
    phone character varying(50),
    country character varying(100),
    province character varying(100),
    address text,
    type character varying(50),
    status character varying(50) DEFAULT 'Active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.providers OWNER TO ikram;

--
-- Name: providers_id_seq; Type: SEQUENCE; Schema: public; Owner: ikram
--

CREATE SEQUENCE public.providers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.providers_id_seq OWNER TO ikram;

--
-- Name: providers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ikram
--

ALTER SEQUENCE public.providers_id_seq OWNED BY public.providers.id;


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: ikram
--

CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.refresh_tokens OWNER TO ikram;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: ikram
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.refresh_tokens_id_seq OWNER TO ikram;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ikram
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- Name: revenue_expenses; Type: TABLE; Schema: public; Owner: ikram
--

CREATE TABLE public.revenue_expenses (
    id integer NOT NULL,
    month character varying(20) NOT NULL,
    revenue numeric NOT NULL,
    expenses numeric NOT NULL
);


ALTER TABLE public.revenue_expenses OWNER TO ikram;

--
-- Name: revenue_expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: ikram
--

CREATE SEQUENCE public.revenue_expenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.revenue_expenses_id_seq OWNER TO ikram;

--
-- Name: revenue_expenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ikram
--

ALTER SEQUENCE public.revenue_expenses_id_seq OWNED BY public.revenue_expenses.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: ikram
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    phone_number character varying(20),
    profile_picture text,
    address text
);


ALTER TABLE public.users OWNER TO ikram;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: ikram
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO ikram;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ikram
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: articles id; Type: DEFAULT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.articles ALTER COLUMN id SET DEFAULT nextval('public.articles_id_seq'::regclass);


--
-- Name: charges id; Type: DEFAULT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.charges ALTER COLUMN id SET DEFAULT nextval('public.charges_id_seq'::regclass);


--
-- Name: client_documents id; Type: DEFAULT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.client_documents ALTER COLUMN id SET DEFAULT nextval('public.client_documents_id_seq'::regclass);


--
-- Name: client_invoices id; Type: DEFAULT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.client_invoices ALTER COLUMN id SET DEFAULT nextval('public.client_invoices_id_seq'::regclass);


--
-- Name: clients id; Type: DEFAULT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.clients ALTER COLUMN id SET DEFAULT nextval('public.clients_id_seq'::regclass);


--
-- Name: finance id; Type: DEFAULT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.finance ALTER COLUMN id SET DEFAULT nextval('public.finance_id_seq'::regclass);


--
-- Name: financial_snapshot id; Type: DEFAULT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.financial_snapshot ALTER COLUMN id SET DEFAULT nextval('public.financial_snapshot_id_seq'::regclass);


--
-- Name: invoices id; Type: DEFAULT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.invoices ALTER COLUMN id SET DEFAULT nextval('public.invoices_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: provider_documents id; Type: DEFAULT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.provider_documents ALTER COLUMN id SET DEFAULT nextval('public.provider_documents_id_seq'::regclass);


--
-- Name: providers id; Type: DEFAULT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.providers ALTER COLUMN id SET DEFAULT nextval('public.providers_id_seq'::regclass);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- Name: revenue_expenses id; Type: DEFAULT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.revenue_expenses ALTER COLUMN id SET DEFAULT nextval('public.revenue_expenses_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: articles; Type: TABLE DATA; Schema: public; Owner: ikram
--

COPY public.articles (id, name, sales, last_sold, product, stock_level, brand, dimensions, description, purchase_price, sale_price, created_at, updated_at, provider_id, used, low_stock, revenue) FROM stdin;
5	Engine Oil B	75	2024-12-14	Accessory	100	Castrol	5W-30 1L	Fully synthetic engine oil for high performance	10.00	15.00	2024-12-23 16:16:55.704075	2024-12-23 16:16:55.704075	5	25	20	1125.00
7	Summer Tire A	180	2024-12-05	Tire	90	Pirelli	215/55 R17	Perfect tire for summer driving conditions	65.00	97.50	2024-12-23 16:16:55.704075	2024-12-23 16:16:55.704075	7	40	10	4000.00
8	Brake Pads D	120	2024-12-03	Accessory	50	Brembo	Standard Size	High-quality brake pads for optimal safety	20.00	30.00	2024-12-23 16:16:55.704075	2024-12-23 16:16:55.704075	8	30	8	3600.00
9	Tire Inflator	40	2024-11-25	Accessory	15	Michelin	Portable	Portable tire inflator for emergency use	50.00	100.00	2024-12-23 16:16:55.704075	2024-12-23 16:16:55.704075	9	5	2	2000.00
10	Wiper Blades E	220	2024-11-20	Accessory	60	Bosch	21-inch	Durable wiper blades for clear visibility	15.00	22.50	2024-12-23 16:16:55.704075	2024-12-23 16:16:55.704075	10	45	10	3300.00
12	test	0	2024-12-23	\N	50	test	test	\N	50.00	50.00	2024-12-23 17:48:17.066545	2024-12-23 17:48:17.066545	\N	0	40	\N
1	Premium only	150	2024-12-20	Tire	120	Michelin	205/55 R16	High-performance tire for all seasons	50.00	75.00	2024-12-23 16:16:06.042219	2024-12-23 18:28:53.987947	1	50	10	3000.00
3	Goodyear	100	2024-12-18	Tire	80	Goodyear	225/45 R17	Optimal performance in snowy conditions	70.00	105.00	2024-12-23 16:16:55.704075	2024-12-26 16:19:24.373986	3	20	10	3500.00
6	engine	300	2024-12-10	Accessory	200	NGK	Standard	Reliable spark plug for various car models	5.00	15.00	2024-12-23 16:16:55.704075	2025-01-02 11:05:20.680648	6	50	30	4500.00
\.


--
-- Data for Name: charges; Type: TABLE DATA; Schema: public; Owner: ikram
--

COPY public.charges (id, charge_type, provider_client, invoice_number, payment_method, charge_date, amount, description, created_at, updated_at) FROM stdin;
1	Purchase	TechCorp	INV12345	Cash	2024-01-15	1500.50	Purchased new laptops for the development team	2024-11-26 14:30:15.120309	2024-11-26 14:30:15.120309
2	Operational Expense	Office Rent	INV54321	Bank Transfer	2024-01-10	2500.00	Monthly rent for January	2024-11-26 14:30:15.120309	2024-11-26 14:30:15.120309
3	Purchase	Green Supplies	INV67890	Credit Card	2024-01-12	890.75	Office stationery and supplies	2024-11-26 14:30:15.120309	2024-11-26 14:30:15.120309
6	Purchase	BlueTech	INV45678	Credit Card	2024-01-13	2450.30	New software licenses for the IT team	2024-11-26 14:30:15.120309	2024-11-26 14:30:15.120309
8	Miscellaneous	TechRepair	INV33445	Cash	2024-01-14	420.00	Repairs for office printers and copiers	2024-11-26 14:30:15.120309	2024-11-26 14:30:15.120309
9	Purchase	FurniturePro	INV55667	Bank Transfer	2024-01-11	3200.00	New office furniture and desks	2024-11-26 14:30:15.120309	2024-11-26 14:30:15.120309
10	Operational Expense	CleanCo	INV77889	Credit Card	2024-01-09	400.00	Office cleaning services for January	2024-11-26 14:30:15.120309	2024-11-26 14:30:15.120309
12	Operational Expense	Provider ikram	3828473282	Credit Card	2025-01-20	520.00	comment test	2025-01-02 15:57:12.869979	2025-01-02 15:57:12.869979
\.


--
-- Data for Name: client_documents; Type: TABLE DATA; Schema: public; Owner: ikram
--

COPY public.client_documents (id, invoice_number, client_name, invoice_date, invoice_type, company_name, company_address, company_registration_number, subtotal, tva_percentage, tva_value, total_price, comments) FROM stdin;
1	1001	Client A	2024-01-10	Type 1	Pneus Maroc SARL	N49 AV Kaboul, Tetouan	14391810	1200.00	20.00	240.00	1440.00	First invoice for Client A
2	1002	Client B	2024-02-15	Type 2	Pneus Maroc SARL	N49 AV Kaboul, Tetouan	14391810	800.00	20.00	160.00	960.00	Second invoice for Client B
3	1003	Client C	2024-03-20	Type 1	Pneus Maroc SARL	N49 AV Kaboul, Tetouan	14391810	500.00	20.00	100.00	600.00	Third invoice for Client C
4	1004	Client D	2024-04-25	Type 3	Pneus Maroc SARL	N49 AV Kaboul, Tetouan	14391810	2000.00	20.00	400.00	2400.00	Fourth invoice for Client D
5	1005	Client E	2024-05-30	Type 2	Pneus Maroc SARL	N49 AV Kaboul, Tetouan	14391810	1500.00	20.00	300.00	1800.00	Fifth invoice for Client E
\.


--
-- Data for Name: client_invoices; Type: TABLE DATA; Schema: public; Owner: ikram
--

COPY public.client_invoices (id, invoice_id, reference_number, description, total_price, client_name, invoice_type, items, date_of_purchase, tva_percentage, comment, initial_price, tva_percentage_1, tva_percentage_2, invoice_number) FROM stdin;
1	1001	REF001	Tire Purchase	800.00	Client A	Article Purchase	["Michelin Tire"]	2024-12-22	20	High-quality tires purchased	\N	\N	\N	1
2	1002	REF002	Accessory Purchase	300.00	Client B	Article Purchase	["Car Accessory A", "Car Accessory B"]	2024-12-21	20	Car accessories purchased for upgrade	\N	\N	\N	2
3	1003	REF003	Oil Change	100.00	Client C	Car Repair	["Oil Change"]	2024-12-20	10	Performed oil change service	\N	\N	\N	3
4	1004	REF004	Tire Rotation	75.00	Client D	Car Repair	["Tire Rotation"]	2024-12-19	10	Tire rotation performed as scheduled	\N	\N	\N	4
5	1005	REF005	Engine Tuning	300.00	Client E	Car Repair	["Engine Tuning"]	2024-12-18	20	Engine tuning service completed	\N	\N	\N	5
6	1006	REF006	Tire Purchase	1320.00	Client F	Article Purchase	["Bridgestone Tire"]	2024-12-17	20	Bulk tire purchase for vehicle fleet	\N	\N	\N	6
11	\N	\N	\N	19772	Test	Car Repair	[{"name": "Oil Change", "units": 4, "unitPrice": 4, "totalPrice": 16}, {"name": "Tire Rotation", "units": 4, "unitPrice": 4939, "totalPrice": 19756}]	2024-12-28	\N	mdakham	\N	\N	\N	7
12	\N	\N	\N	69120	some name	Car Repair	[{"name": "Tire Rotation", "units": 120, "unitPrice": 400, "totalPrice": "69120.00", "tvaPercentage1": 20, "tvaPercentage2": 20}]	2024-12-28	\N	mdakham hadchi	\N	\N	\N	8
13	\N	\N	\N	1434491.5199999998	update real time	Article Purchase	[{"name": "Bridgestone Tire", "units": 2728, "unitPrice": 313, "totalPrice": "1434491.52", "tvaPercentage1": 20, "tvaPercentage2": 40}]	2024-12-28	\N	\N	\N	\N	\N	9
14	\N	\N	\N	596.2320000000001	ikram	Car Repair	[{"name": "Tire Rotation", "units": 13, "unitPrice": 42, "totalPrice": "596.23", "tvaPercentage1": 5, "tvaPercentage2": 4}]	2024-12-28	\N	test test	\N	\N	\N	10
15	\N	\N	\N	1.0609	test	Car Repair	[{"name": "Tire Rotation", "units": 1, "unitPrice": 1, "totalPrice": "1.06", "tvaPercentage1": 3, "tvaPercentage2": 3}]	2024-12-28	\N	testttttt	\N	\N	\N	12-002
16	\N	\N	\N	17.808000000000003	test2	Article Purchase	[{"name": "Car Accessory A", "units": 4, "unitPrice": 4, "totalPrice": "17.81", "tvaPercentage1": 5, "tvaPercentage2": 6}]	2024-12-28	\N	comments	\N	\N	\N	12-003
17	\N	\N	\N	783288137.2239	test3	Car Repair	[{"name": "Tire Rotation", "units": 3223, "unitPrice": 2331, "totalPrice": "783288137.22", "tvaPercentage1": 3231, "tvaPercentage2": 213}]	2024-12-28	\N	Ress	\N	\N	\N	12-004
18	\N	\N	\N	2780.8704	decdqe	Car Repair	[{"name": "Oil Change", "units": 33, "unitPrice": 44, "totalPrice": "2780.87", "tvaPercentage1": 33, "tvaPercentage2": 44}]	2024-12-28	\N	32333	\N	\N	\N	12-005
19	\N	\N	\N	253.81249999999997	amber	Article Purchase	[{"name": "Bridgestone Tire", "units": 5, "unitPrice": 5, "totalPrice": "253.81", "tvaPercentage1": 55, "tvaPercentage2": 555}]	2024-12-28	\N	reg	\N	\N	\N	12-006
20	\N	\N	\N	3450	cwvced	Article Purchase	[{"name": "Bridgestone Tire", "units": 50, "unitPrice": 50, "totalPrice": "3450.00", "tvaPercentage1": 20, "tvaPercentage2": 15}]	2024-12-28	\N	vfgdb 	\N	\N	\N	12-007
21	\N	\N	\N	55.199999999999996	fvjknfvkjvf	Article Purchase	[{"name": "Goodyear Tire", "units": 1, "unitPrice": 40, "totalPrice": "55.20", "tvaPercentage1": 20, "tvaPercentage2": 15}]	2024-12-28	\N	je suis un taliban	\N	\N	\N	12-008
22	\N	\N	\N	602.064	ikramita	Article Purchase	[{"name": "Bridgestone Tire", "units": 12, "unitPrice": 40, "totalPrice": "602.06", "tvaPercentage1": 13, "tvaPercentage2": 11}]	2024-12-28	\N	11dcdd	\N	\N	\N	12-009
\.


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: ikram
--

COPY public.clients (id, company_name, nif, client_name, client_type, phone1, phone2, phone3, iceo, country, province, postal_code, email1, email2, email3) FROM stdin;
14	Mac company	83837372	ikram ikram	corporate	\N	\N	\N	jdch8373627282	Japan	Tokyo	80222	\N	\N	\N
10	Afrah tetouan	938474732883	Ahmed Ghomari	corporate	\N	\N	\N	0073728283727	morocco	Tetouan-Mdiq	\N	ikram@gmail.com	ikram@ikram.com	fes@fes.com
\.


--
-- Data for Name: finance; Type: TABLE DATA; Schema: public; Owner: ikram
--

COPY public.finance (id, revenue, expenses, profit, date, outstanding, paid, month, due_date, due_invoices) FROM stdin;
1	50000.00	30000.00	20000.00	2024-12-20	\N	\N	\N	\N	\N
2	45000.00	25000.00	20000.00	2024-12-21	\N	\N	\N	\N	\N
3	55000.00	32000.00	23000.00	2024-12-22	\N	\N	\N	\N	\N
7	\N	\N	\N	2024-12-22	\N	\N	\N	2024-10-01	5
8	\N	\N	\N	2024-12-22	\N	\N	\N	2024-10-10	7
9	\N	\N	\N	2024-12-22	\N	\N	\N	2024-10-20	4
10	10000.00	7000.00	\N	2024-12-22	\N	\N	January	\N	\N
11	12000.00	8000.00	\N	2024-12-22	\N	\N	February	\N	\N
12	9000.00	6000.00	\N	2024-12-22	\N	\N	March	\N	\N
\.


--
-- Data for Name: financial_snapshot; Type: TABLE DATA; Schema: public; Owner: ikram
--

COPY public.financial_snapshot (id, total_revenue, total_expenses, net_profit, report_date) FROM stdin;
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: ikram
--

COPY public.invoices (id, client_name, date_of_purchase, total_price) FROM stdin;
10001	John Doe	2024-01-01	200
\.


--
-- Data for Name: made_bills; Type: TABLE DATA; Schema: public; Owner: ikram
--

COPY public.made_bills (id, provider, amount, method, date, status) FROM stdin;
MB001	Morgan, Lee and Frederick	1389.73	Check	2024-01-21	Paid
MB002	Jones-Chapman	4524.49	Check	2024-02-04	Overdue
MB003	Cook Group	787.01	Online Payment	2024-05-19	Paid
MB004	Clark Inc	1454.65	Check	2024-01-23	Pending
MB006	Hernandez-Hill	2254.45	Bank Transfer	2024-03-15	Paid
MB007	Brown LLC	3499.12	Credit Card	2024-06-11	Pending
MB008	Lopez and Sons	2003.99	Cash	2024-04-22	Overdue
MB009	Taylor Inc	978.23	Online Payment	2024-07-18	Paid
MB011	Greenfelder LLC	1098.45	Bank Transfer	2023-12-10	Paid
MB012	Walker-Lewis	2543.78	Credit Card	2023-11-15	Overdue
MB013	King Group	3120.50	Cash	2024-02-28	Pending
MB014	White Ltd.	1890.67	Online Payment	2023-10-22	Paid
MB015	Hall and Sons	2765.23	Check	2023-09-17	Overdue
MB016	Evans PLC	1324.88	Cash	2023-08-05	Paid
MB017	Parker Inc	2100.34	Bank Transfer	2024-03-11	Pending
MB018	Mitchell Group	3452.29	Credit Card	2024-04-18	Paid
MB019	Collins Ltd.	4021.76	Online Payment	2024-06-22	Pending
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: ikram
--

COPY public.payments (id, payer, amount, method, date, status, created_at, updated_at) FROM stdin;
1	John Doe	150.75	Credit Card	2024-11-20 14:00:00	Paid	2024-11-27 19:20:50.153233	2024-11-27 19:20:50.153233
2	Jane Smith	200.00	Bank Transfer	2024-11-21 09:30:00	Pending	2024-11-27 19:20:50.153233	2024-11-27 19:20:50.153233
3	Acme Corp	1000.50	Cash	2024-11-19 13:45:00	Paid	2024-11-27 19:20:50.153233	2024-11-27 19:20:50.153233
4	Global Solutions	500.00	Credit Card	2024-11-22 15:15:00	Paid	2024-11-27 19:20:50.153233	2024-11-27 19:20:50.153233
5	Doe Enterprises	750.25	Bank Transfer	2024-11-23 11:00:00	Pending	2024-11-27 19:20:50.153233	2024-11-27 19:20:50.153233
6	Tech Innovators	300.00	Cash	2024-11-20 10:20:00	Paid	2024-11-27 19:20:50.153233	2024-11-27 19:20:50.153233
7	Future LLC	120.90	Credit Card	2024-11-24 14:10:00	Paid	2024-11-27 19:20:50.153233	2024-11-27 19:20:50.153233
9	Smith & Co	75.25	Cash	2024-11-25 09:00:00	Paid	2024-11-27 19:20:50.153233	2024-11-27 19:20:50.153233
11	Star Enterprises	320.10	Cash	2024-11-18 17:00:00	Paid	2024-11-27 19:20:50.153233	2024-11-27 19:20:50.153233
12	Bright Futures	950.00	Credit Card	2024-11-19 15:45:00	Paid	2024-11-27 19:20:50.153233	2024-11-27 19:20:50.153233
13	Omega Systems	410.75	Bank Transfer	2024-11-24 10:00:00	Pending	2024-11-27 19:20:50.153233	2024-11-27 19:20:50.153233
15	Alpha Enterprises	620.00	Credit Card	2024-11-23 13:15:00	Paid	2024-11-27 19:20:50.153233	2024-11-27 19:20:50.153233
16	Beta Corp	360.20	Cash	2024-11-20 08:45:00	Paid	2024-11-27 19:20:50.153233	2024-11-27 19:20:50.153233
18	Delta Dynamics	280.30	Credit Card	2024-11-19 11:20:00	Paid	2024-11-27 19:20:50.153233	2024-11-27 19:20:50.153233
21	Oil company	450.00	Cash	2024-12-23 23:00:00	Paid	2024-12-26 16:41:21.833621	2024-12-26 16:41:21.833621
\.


--
-- Data for Name: provider_documents; Type: TABLE DATA; Schema: public; Owner: ikram
--

COPY public.provider_documents (id, invoice_number, provider_name, invoice_type, date, total_price_with_tva) FROM stdin;
1	INV-1001	Provider A	Standard	2024-12-01	1200.50
2	INV-1002	Provider B	Express	2024-12-02	850.75
3	INV-1003	Provider C	Standard	2024-12-03	980.30
4	INV-1004	Provider D	Express	2024-12-04	1450.00
5	INV-1005	Provider E	Standard	2024-12-05	1110.25
6	INV-1006	Provider F	Express	2024-12-06	1250.00
7	INV-1007	Provider G	Standard	2024-12-07	900.40
8	INV-1008	Provider H	Express	2024-12-08	1350.60
9	INV-1009	Provider I	Standard	2024-12-09	1010.00
10	INV-1010	Provider J	Express	2024-12-10	1400.00
\.


--
-- Data for Name: providers; Type: TABLE DATA; Schema: public; Owner: ikram
--

COPY public.providers (id, name, orders, pending, value, label, color, email, phone, country, province, address, type, status, created_at, updated_at) FROM stdin;
3	Provider C	120	15	3000.00	Unknown	#3357FF	providerC@example.com	+1234567892	Morocco	Rabat	789 Road, Rabat	Wholesale	Active	2024-12-23 12:59:53.301519	2024-12-23 12:59:53.301519
4	Provider D	180	30	7000.00	Unknown	#FF33A6	providerD@example.com	+1234567893	Spain	Madrid	101 Plaza, Madrid	Retail	Active	2024-12-23 12:59:53.301519	2024-12-23 12:59:53.301519
5	Provider E	250	70	15000.00	Unknown	#FFA533	providerE@example.com	+1234567894	USA	New York	202 Blvd, NY	Wholesale	Inactive	2024-12-23 12:59:53.301519	2024-12-23 12:59:53.301519
6	Provider F	90	10	2000.00	Unknown	#A533FF	providerF@example.com	+1234567895	Canada	Quebec	303 Lane, Quebec	Retail	Active	2024-12-23 12:59:53.301519	2024-12-23 12:59:53.301519
7	Provider G	300	100	25000.00	Unknown	#FF5733	providerG@example.com	+1234567896	Morocco	Casablanca	404 Circle, Casa	Wholesale	Inactive	2024-12-23 12:59:53.301519	2024-12-23 12:59:53.301519
8	Provider H	50	5	1000.00	Unknown	#33FFA5	providerH@example.com	+1234567897	Spain	Barcelona	505 Square, Barcelona	Retail	Active	2024-12-23 12:59:53.301519	2024-12-23 12:59:53.301519
9	Provider I	400	120	40000.00	Unknown	#FF33F5	providerI@example.com	+1234567898	USA	Texas	606 Park, Texas	Wholesale	Active	2024-12-23 12:59:53.301519	2024-12-23 12:59:53.301519
1	Provider B	150	20	5000.00	Unknown	#FF5733	providerA@example.com	+1234567890	USA	California	123 Street, LA	Wholesale	Active	2024-12-23 12:59:53.301519	2024-12-23 12:59:53.301519
10	Provider J	100	25	2500.00	Unknown	#33A5FF	providerJ@example.com	+1234567899	Canada	Alberta	707 Terrace, Alberta	Retail	Inactive	2024-12-23 12:59:53.301519	2024-12-23 12:59:53.301519
2	Provider MAROC auto company	200	50	10000.00	Unknown	#33FF57	providerB@example.com	+1234567891	Canada	Ontario	456 Avenue, Toronto	Retail	Inactive	2024-12-23 12:59:53.301519	2024-12-23 12:59:53.301519
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: ikram
--

COPY public.refresh_tokens (id, user_id, token, created_at) FROM stdin;
1	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJpa3JhbSIsImlhdCI6MTczMzUwNzAwMX0.xnbmNTIRiY639hPVFyi_Yls4oe8NlUc3Dquqz2L-KyQ	2024-12-06 17:43:21.8224
2	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJpa3JhbSIsImlhdCI6MTczMzU3MDk2NX0.6KWCeBGLWS7jKalON6KKVzMQcIQTfmslQ4UA_2wOSaE	2024-12-07 11:29:25.728534
3	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJpa3JhbSIsImlhdCI6MTczMzU3MjEwNn0.JZLJ84n54D4iOrV_6x3OxT4hhV3kYU_QYp3ibBCk9Ac	2024-12-07 11:48:26.298046
4	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJpa3JhbSIsImlhdCI6MTczMzU3MjEzOH0.4a-HsL6zOBWcZEzO1xlGIg5Le9zQSDm-a1KihXoWWsw	2024-12-07 11:48:58.325228
5	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJpa3JhbSIsImlhdCI6MTczMzU3MjIxMn0.eidxFdc2rBIjEiV0v-yFwjcjruDgxP_pOLXDM1J_B60	2024-12-07 11:50:12.896679
6	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJpa3JhbSIsImlhdCI6MTczMzU3MjIzNn0.DMvKy9_13WoFbtJmWrAUKdt-DQ2XPn4eXyDp-VzKfds	2024-12-07 11:50:36.810575
7	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJpa3JhbSIsImlhdCI6MTczMzU3MjQ3OX0.7UoXUBNyfrJG5n-yKoXLKl8XRwIpjPBRD717YxcXHmk	2024-12-07 11:54:39.222393
8	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJpa3JhbSIsImlhdCI6MTczMzU3MjU1N30.2BjtPOiNaCGyf6n6J3TuC7qvvyZetqrryDAIE2CaDiQ	2024-12-07 11:55:57.427161
9	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJpa3JhbSIsImlhdCI6MTczMzU3MjY4NH0.HF3Pa0xHN7GXY0pP7eQvHqFk1oAHszWcHf3TTTI6btc	2024-12-07 11:58:04.814043
10	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJpa3JhbSIsImlhdCI6MTczMzU3Mjc5Nn0.GVX2C5AMIw-yKjqTTolgprciWyo9XUvfk_5eHX_EdHY	2024-12-07 11:59:56.882834
11	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJpa3JhbSIsImlhdCI6MTczMzU3MjgxOX0.ZC5RxEA-q3P6k_-eOY5gfn47iHWhOm3B2mLLClVp_Ws	2024-12-07 12:00:19.066423
12	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJpa3JhbSIsImlhdCI6MTczMzU3MjgzM30.onl37QUBZluPXbviOtEDpTHxDISqQkj-JsKoP_ygGv8	2024-12-07 12:00:33.046333
13	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJpa3JhbSIsImlhdCI6MTczMzU3Mjg2NH0.fTETxD4QkWDjIYu0wykkMijCdGR5Iyx3jXUr8nUADh8	2024-12-07 12:01:04.32399
14	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJpa3JhbSIsImlhdCI6MTczMzU3MjkzMn0.bIQrM6dXDVYY4SCGejJ0S-lKbgVNvV2sFDc5_kKRnb0	2024-12-07 12:02:12.234271
15	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJpa3JhbSIsImlhdCI6MTczMzU3Mjk0NH0.nfnDR7mZDH-wXUnm21rytnVPLBBgBWiloGK9MR26Bu8	2024-12-07 12:02:24.621563
16	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJpa3JhbSIsImlhdCI6MTczMzU3NDA4NX0.IDtMVbDvrEMCTo_er8KNG62xqZpRJyuYihQr2D1CnFE	2024-12-07 12:21:25.192992
17	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJpa3JhbSIsImlhdCI6MTczMzYwMzc3NX0.hPZnO5bLPoGm-A9ZH6ChsZTxX_voZwsbhMVY2fPt8GM	2024-12-07 20:36:15.311712
18	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJpa3JhbSIsImlhdCI6MTczMzYwMzg4OX0.ueXmSZmxgNa-O2-PjiyQY8Lk8k7kE741w3SlZuZzqlA	2024-12-07 20:38:09.751316
19	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJpa3JhbSIsImlhdCI6MTczMzYwMzk2MH0.arDkPxHhfpwx16RExU8RuMTpdksiPQKURVsg8wfpX8o	2024-12-07 20:39:20.368482
20	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJpa3JhbSIsImlhdCI6MTczMzc1MjM1MH0.lymeJv5ij8Xp3aLNFo_Ud_PGKhKn3Cn2Uff0eSP_4c4	2024-12-09 13:52:30.186026
21	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJpa3JhbSIsImlhdCI6MTczMzgyNjUzMH0.TG1rpGuGxMzjh2Z30Om90hgJTuxDsDa7k5uZcKkKJak	2024-12-10 10:28:50.867275
22	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJpa3JhbSIsImlhdCI6MTczMzgyNjg0NH0.OAKlfS4qWaRLMAMEVjm0xZVftm3tll4kOHp8nO8ZuLE	2024-12-10 10:34:04.555536
23	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJpa3JhbSIsImlhdCI6MTczMzgyNjg1M30.l-58HgDAFJdYHjsBT5bgewBuds_nNAl2jqGUMnQrwJc	2024-12-10 10:34:13.274998
24	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzMzOTU0Mzk1fQ.RJVoGrT1kJcMk5Ih6QAU-pkTH8xbwLpqXazLqOVnPF4	2024-12-11 21:59:55.859019
25	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0MTg5NTA1fQ.eq7nqUFiG2jvKednvX37F4V2k0UbrqlXZIwD4D73a8U	2024-12-14 15:18:25.258327
26	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0MTkzMjczfQ.n_PI90nAoYK0HMBD98ZXtGre-Bc-REHu6QKe1crxqkI	2024-12-14 16:21:13.509621
27	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0MzcxMDk0fQ.2jjcNqcg-rLjh-AtcsZF631S8LmTNi5kp5kO4VWf-IM	2024-12-16 17:44:54.577799
28	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0NDY2NTcwfQ.yYyNAatuwfNs0P9NMEj75wQIlzS6ZMIO5oyD0mprvC0	2024-12-17 20:16:10.572807
29	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0NDcwMzg3fQ.h-UPo8MwtETouG0KZca-faR_6grbBe1x3cx5OMXGQAQ	2024-12-17 21:19:47.469858
30	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0NDcwNDc0fQ.WQcQQiPedJfhF2Wj_-76Yj-XYSgqwL1FDGGzZ7VzPpc	2024-12-17 21:21:14.791597
31	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0NDcxMjU1fQ.mN5hp97eqWldCRWmS8yvWSk2YYsQJQ2gGPMcSy80Tq8	2024-12-17 21:34:15.424813
32	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0NTQ5NTg1fQ.VvMvsrs842HZkWrZB2w-qeBdWROvGpRmACbCucWUP08	2024-12-18 19:19:45.941607
33	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0NTUzMTU0fQ.MBm0JR80mzKpnr6E-raq1avyu1_42l_tNgh0PWSxsVU	2024-12-18 20:19:14.246131
34	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0NjMzOTI0fQ.wcxhkQLcmN1-BwgbbsMM75kVe9xtcsJ8HYpyMR-9Pc0	2024-12-19 18:45:24.135712
35	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0NjM1NDAxfQ.iq509ZOdVodir53v9neeNMevUM3yfWAgd5_DMooWsUM	2024-12-19 19:10:01.086163
36	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0NjM2NTMwfQ.ZsMRfMZk7Tpk0qwKedbOndSmlOJd2bb5XGyd-e2Bgaw	2024-12-19 19:28:50.7146
37	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0NjM4NjMxfQ.FNid3vNWmvxOSqb_04Q8b1CI74RE61Y-V9at-TWO-HM	2024-12-19 20:03:51.268647
38	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0ODAzNTk2fQ.7Qu-xwDiGLxIoNkmu9b1tL3YS1ZxsUr-j1aH6AHZLs8	2024-12-21 17:53:16.562825
39	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0ODA0ODg2fQ.vlSxT1STJVY6ULCZuTxa5AP-B07yIRPKS0tr0_oPqDQ	2024-12-21 18:14:46.448232
40	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0ODA5MTUwfQ.yx24I71Awd6Rs2HnHzbx8h4xacqTW_-x8xzdWy2DHoY	2024-12-21 19:25:50.091302
41	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0ODEwNTAyfQ.L--ki3w2Q1Zn1qSsFxYCQhFBs7RFiN2y5ujvdza6cRE	2024-12-21 19:48:22.400324
42	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0ODIyNDY3fQ.NA1Wm863F4BVA_Kfz31f-mORtIFt9hY37ta4vxowFcY	2024-12-21 23:07:47.59799
43	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0ODI0NzMxfQ.8tRsLD2aMv4nISLLf364hpGMLF2WF-R9jPz_u0I7BD0	2024-12-21 23:45:31.62352
44	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0ODI0Nzc0fQ.bKRJ0l_GVXvySZU7AuEKFMlbfc8aJEmKjdRRIjTnnbc	2024-12-21 23:46:14.427892
45	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0ODg1ODIzfQ.dg7gt5CYD60p5SgwTt3fJYVvcgAh_kNuMUGCTEOC-3U	2024-12-22 16:43:43.283011
46	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0ODg1OTg1fQ.4aV8vkr9ubd3qB-GfdtRGEnGt833_pStsWXVtLJXSRA	2024-12-22 16:46:25.550588
47	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0ODg2OTM3fQ.CZ2_Agn2zJjqQ0cj1gOv36ofMjo2EB4w4_ZUx9NZxds	2024-12-22 17:02:17.205461
48	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0ODg2OTgzfQ.Wz-kVa-1JOVaxaBL2A_i5NKmibadZ-D5qnfJ8znYcY4	2024-12-22 17:03:03.972841
49	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0ODg4MTM4fQ.abt-PBdi85D9X43c_pqUa7piHiXlXIXhSeWw7WCeHYY	2024-12-22 17:22:18.553154
50	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0ODg4NTY5fQ.0A_KOumaYDRJ9jKuPSRRoaWaleFuSGcTN2eqn0Bhx94	2024-12-22 17:29:29.1613
51	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0ODg4Nzc0fQ.nZHKxrMWK0JgEzxhRYfRbD4cyTeiRmWp2pyxt_VJXBQ	2024-12-22 17:32:54.346259
52	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0ODg4ODIzfQ.-MOpuc0X8d9pO2YqIlBPfQoOes9sFT58n3RYWFEd8GQ	2024-12-22 17:33:43.621051
53	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0ODk0MDQyfQ.YheyQzhpcjCS07EyUToIM6ENbRvYWf1IS71L-bHg1GU	2024-12-22 19:00:42.813507
54	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0ODk0MDc4fQ.N-KojIqQFSCAT-ba8bKMiev9wS76CZlZ2iBMmclB_ko	2024-12-22 19:01:18.911282
55	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0OTAzNTA3fQ.1IdpE91Y4MYDSvUrdkSKhkpZ9xgOhXb2ly-jvGI-7fs	2024-12-22 21:38:27.439387
56	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0OTAzNTczfQ.pOgJ30Y4ytlDmgZ_9XF_kTeVzBXdmoKhOzUtz0Rhvpw	2024-12-22 21:39:33.613475
57	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0OTA0NTUyfQ.6x0H2E1PNrOAviBupC0RNPpEN5pwbrBT48muIYLIBsA	2024-12-22 21:55:52.874061
58	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0OTU0NDY2fQ.Bsu922xUW52WlJgKfY1NGNO9lQrdChLEXXUrtPUQ828	2024-12-23 11:47:46.699545
59	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0OTU3MjEzfQ.AhguFECh2cjGy47r2T8B-MWaKoVXX0ZpHP02yZlwBtA	2024-12-23 12:33:33.040729
60	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0OTU4NjM2fQ.727Fm95hRBAXjmbC-_YVU9sqtoH1udokCb7d2YA9WsE	2024-12-23 12:57:16.484742
61	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0OTU4ODI1fQ.vhe9YTVWB_aXbhqkMzi3ugjVwnFWg5Dp4fEIwrl8EJs	2024-12-23 13:00:25.024051
62	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0OTcwNjUwfQ.HfrzSP_wMWzzj8kvRVEQxa_k6tdsE1DK2Y-IHE3AbEw	2024-12-23 16:17:30.964188
63	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0OTcwNzg3fQ.09LPW0W_jOpajQr23OeZIsraypLV7s_NT_ZzVxw5CUk	2024-12-23 16:19:47.562219
64	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0OTcxMTYxfQ.oNb4KrUDk_SdhkJXhYBX8SYqjo3kIih4xoFhp5HmNr0	2024-12-23 16:26:01.218004
65	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0OTc2MzEwfQ.OyDEoFOIm5IRORAiouK9FEPuPjTSv3eCfPULoPdm8MI	2024-12-23 17:51:50.938478
66	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0OTc5ODI3fQ.hiz6KyECEuRg0lUZ9w-p4uqDUakjVykMMk_eUy0N_30	2024-12-23 18:50:27.912695
67	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM0OTkyOTk1fQ.j_y6rh_Jylw7_rghWMfU0068JCzmQ5jgIg8XQRhSK74	2024-12-23 22:29:55.680857
68	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM1MDUwOTg3fQ.OSCweSsGa8rE3ZMkEMlVSX_5qHtTAVxcq7KEdEuLXcs	2024-12-24 14:36:27.124655
69	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM1MDUxMzM1fQ.a9eLE33wekSc9ZdEKJ3fCnXt-JXlucbEqSc5sjsrP-w	2024-12-24 14:42:15.416105
70	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM1MDUxOTg0fQ.Sc5QtWtfcC5DAhManFQOh-4-7g9nawOGgRWdZm_OvzU	2024-12-24 14:53:04.103663
71	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM1MjE0MDIzfQ.lS_Mui3eA6gtCM9W4C7OdQ-ycS8DNMq1rGVlWqBOvzk	2024-12-26 11:53:43.038543
72	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM1MjIwNTQyfQ.fWaYTo39CEUM_HsmzY_81FK1JBXkuy5W352JEcP3xVs	2024-12-26 13:42:22.819975
73	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM1MjIxNjc1fQ.kf3u4DDcBc4GxhlnMNcaSlAv4UsScAfysPsK-Yc9RaI	2024-12-26 14:01:15.396147
74	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM1NDEwMjcwfQ.PNY6Bw1HcgUod38BL5gkPciNsGjfO7uBdJyBf48N2Ss	2024-12-28 18:24:30.595022
75	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM1NDExNjk2fQ.34LR4UEwZjv4qTuJgmy6LYLFKXvIBBaOqMXpgh2-XQc	2024-12-28 18:48:16.937845
76	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM1NDE0NTg3fQ.GI4NF3InpDFokroK57OUt1uhTI-5oAU21L8tLnelVNU	2024-12-28 19:36:27.768985
77	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM1NDE0NzYxfQ.hvEz-3EqpcuyXG9GT8Hsj7OFJezXvxqPfL8a5yTAoHE	2024-12-28 19:39:21.000457
78	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM1ODE2MDU0fQ.FWXMATboD3kQjrCjfdhNzVWS9C0efLs8THWZW-ncex4	2025-01-02 11:07:34.183348
79	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM1ODE2MTAxfQ.tXbxEMuvXG2tFpGVDNF6QB5Y4l71qUZhznuac_AUHuQ	2025-01-02 11:08:21.165575
80	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM1ODE2NDEzfQ.yZrzjXewA7DuPA0TbkAa67EkMySf32_NTxumXijJQzg	2025-01-02 11:13:33.838642
81	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM1ODE3MjI2fQ.CsBS2djVBX-A6MtJG-9cmanIgYqi45HEtP6QpKB55EI	2025-01-02 11:27:06.736125
82	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM1ODE3NTM2fQ.CPJi7--_wus7TL7TNg-GvIJu0DdFMHusTS_NYIW_hLU	2025-01-02 11:32:16.461643
83	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM1ODE3NjI2fQ.lGwh3Z02hls8FumHvDvZWSdf0CpOPF64rTZt5atjytY	2025-01-02 11:33:46.092906
84	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM1ODE4MDE4fQ.88y4qt-vBvhVZaGApxrFtiyGLBgBnHzpCnFcgQowmyY	2025-01-02 11:40:18.761747
85	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM1ODE4MTUwfQ.nUFNN1lHpyRH7GrFbvbqZLGDCz3jS9dqW2rPsBWyKKA	2025-01-02 11:42:30.032017
86	7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhc3RlcmlhIiwiaWF0IjoxNzM1ODE5NzEzfQ.9lAjeycfG2TZ1Iz_c03-IVBU54_rH1aQEfFzlIIiiDw	2025-01-02 12:08:33.266899
87	8	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwidXNlcm5hbWUiOiJpa3JhbSIsImlhdCI6MTczNTgyMDU0OH0.ZS8cY_rIUcwfSx4QO0GHHqxeid2oTeTIUECQgW36Aw0	2025-01-02 12:22:28.294326
88	8	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwidXNlcm5hbWUiOiJpa3JhbSIsImlhdCI6MTczNTgyMDkwMn0.UEymhsUbXIa0PHVJvKNCmH898FyRQi20aiUP7A-dNWk	2025-01-02 12:28:22.029203
89	9	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwidXNlcm5hbWUiOiJsaGFqbW91bmlyIiwiaWF0IjoxNzM1ODM0NTUzfQ.bV4OlThn0drX9WobcioDTaNfTHqr3Suj03_DgTHXILM	2025-01-02 16:15:53.374079
\.


--
-- Data for Name: revenue_expenses; Type: TABLE DATA; Schema: public; Owner: ikram
--

COPY public.revenue_expenses (id, month, revenue, expenses) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: ikram
--

COPY public.users (id, username, email, password, role, created_at, updated_at, phone_number, profile_picture, address) FROM stdin;
1	adminprox	adminprox@example.com	$2b$10$uAEZbGQnpRxJk5OQO6lzQeEZ8.QI3WEJ5LdCXyfQfIly5RQEx2EOm	admin	2024-12-03 11:46:06.53341	2024-12-03 11:46:06.53341	\N	\N	\N
2	johnthebeast	johnthebeast@example.com	$2b$10$yJj8F/Dp4/VXhrLgqY/jBe1FjOMR8EKqcK8tbzdbCp6clUuMLFTmm	user	2024-12-03 11:46:06.53341	2024-12-03 11:46:06.53341	\N	\N	\N
3	janedestroyer	janedestroyer@example.com	$2b$10$DLKr9G0i3eDbb5MsMkIjdu3AkntAmGy.mzX6QyNOXwdnZlWWF4T2m	user	2024-12-03 11:46:06.53341	2024-12-03 11:46:06.53341	\N	\N	\N
4	provideradmin	provideradmin@example.com	$2b$10$gPhCpZn.1HwO5IckS51XhO6zHi6sALy2slTOa.XQntUjy/vrOoV8C	provider	2024-12-03 11:46:06.53341	2024-12-03 11:46:06.53341	\N	\N	\N
5	clientmaster	clientmaster@example.com	$2b$10$0HJG3luzwhQ/UiRz5X.b7OSHlNp2xyklVuxMa.kTVnzUOt8qzOx7e	client	2024-12-03 11:46:06.53341	2024-12-03 11:46:06.53341	\N	\N	\N
7	asteria	4573r14@gmail.com	$2b$10$kSnReoHmmMm/3qTIFHdM4OKDYg5cDDfmS7sKlN/5me3qz2Z3Y9rG6	user	2024-12-03 11:59:46.712197	2025-01-02 11:45:37.337157	\N	/uploads/1735818336078-285344105-IMG_1136-2 4.jpg?timestamp=1735818336097	4573r14@gmail.com
8	ikram	ikramkharbouchh@gmail.com	$2b$10$e5JcBH9ceaR.810wDeTocu2QF9xNGb2kRFrv34rmU5Ejg6LP01Gbq	user	2025-01-02 12:22:19.450803	2025-01-02 12:28:07.028925	\N	/uploads/1735820885374-801979427-IMG_1136-2 4.jpg?timestamp=1735820885427	\N
9	lhajmounir	hajmounir@gmail.com	$2b$10$cTBZKEofstNS3yP/KvuXeOVJY5RWtdpXRLeMmXioYqU9ucG/G8oZm	user	2025-01-02 16:15:45.23318	2025-01-02 16:15:45.23318	\N	\N	\N
\.


--
-- Name: articles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ikram
--

SELECT pg_catalog.setval('public.articles_id_seq', 12, true);


--
-- Name: charges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ikram
--

SELECT pg_catalog.setval('public.charges_id_seq', 12, true);


--
-- Name: client_documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ikram
--

SELECT pg_catalog.setval('public.client_documents_id_seq', 5, true);


--
-- Name: client_invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ikram
--

SELECT pg_catalog.setval('public.client_invoices_id_seq', 22, true);


--
-- Name: client_invoices_invoice_number_seq; Type: SEQUENCE SET; Schema: public; Owner: ikram
--

SELECT pg_catalog.setval('public.client_invoices_invoice_number_seq', 10, true);


--
-- Name: clients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ikram
--

SELECT pg_catalog.setval('public.clients_id_seq', 14, true);


--
-- Name: finance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ikram
--

SELECT pg_catalog.setval('public.finance_id_seq', 12, true);


--
-- Name: financial_snapshot_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ikram
--

SELECT pg_catalog.setval('public.financial_snapshot_id_seq', 1, false);


--
-- Name: invoice_number_seq; Type: SEQUENCE SET; Schema: public; Owner: ikram
--

SELECT pg_catalog.setval('public.invoice_number_seq', 9, true);


--
-- Name: invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ikram
--

SELECT pg_catalog.setval('public.invoices_id_seq', 1, false);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ikram
--

SELECT pg_catalog.setval('public.payments_id_seq', 21, true);


--
-- Name: provider_documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ikram
--

SELECT pg_catalog.setval('public.provider_documents_id_seq', 10, true);


--
-- Name: providers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ikram
--

SELECT pg_catalog.setval('public.providers_id_seq', 17, true);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ikram
--

SELECT pg_catalog.setval('public.refresh_tokens_id_seq', 89, true);


--
-- Name: revenue_expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ikram
--

SELECT pg_catalog.setval('public.revenue_expenses_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ikram
--

SELECT pg_catalog.setval('public.users_id_seq', 9, true);


--
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);


--
-- Name: charges charges_pkey; Type: CONSTRAINT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.charges
    ADD CONSTRAINT charges_pkey PRIMARY KEY (id);


--
-- Name: client_documents client_documents_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.client_documents
    ADD CONSTRAINT client_documents_invoice_number_key UNIQUE (invoice_number);


--
-- Name: client_documents client_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.client_documents
    ADD CONSTRAINT client_documents_pkey PRIMARY KEY (id);


--
-- Name: client_invoices client_invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.client_invoices
    ADD CONSTRAINT client_invoices_pkey PRIMARY KEY (id);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: finance finance_pkey; Type: CONSTRAINT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.finance
    ADD CONSTRAINT finance_pkey PRIMARY KEY (id);


--
-- Name: financial_snapshot financial_snapshot_pkey; Type: CONSTRAINT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.financial_snapshot
    ADD CONSTRAINT financial_snapshot_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: made_bills made_bills_pkey; Type: CONSTRAINT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.made_bills
    ADD CONSTRAINT made_bills_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: provider_documents provider_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.provider_documents
    ADD CONSTRAINT provider_documents_pkey PRIMARY KEY (id);


--
-- Name: providers providers_pkey; Type: CONSTRAINT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.providers
    ADD CONSTRAINT providers_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: revenue_expenses revenue_expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.revenue_expenses
    ADD CONSTRAINT revenue_expenses_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: articles set_updated_at; Type: TRIGGER; Schema: public; Owner: ikram
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users update_users_updated_at_trigger; Type: TRIGGER; Schema: public; Owner: ikram
--

CREATE TRIGGER update_users_updated_at_trigger BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_users_updated_at();


--
-- Name: articles articles_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.providers(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ikram
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

