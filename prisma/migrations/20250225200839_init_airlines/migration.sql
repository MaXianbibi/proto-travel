-- CreateTable
CREATE TABLE "Airline" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "iata" TEXT,
    "icao" TEXT,
    "active" BOOLEAN,
    "acceptingComplaints" BOOLEAN,
    "website" TEXT,

    CONSTRAINT "Airline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Airline_iata_key" ON "Airline"("iata");

-- CreateIndex
CREATE UNIQUE INDEX "Airline_icao_key" ON "Airline"("icao");
