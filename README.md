# GeoLocationEncoding
Encoding Decoding of Geo Location for compactness for easy-in-sharing location

Storing Latitude & Longitude in database occupy 32 bits each means total *64 bits*. but while transmitting coordinates over http with content-type text/plain or text/html, all digits, signs, floating points & seprater are treated as text-charecter, which occupy 8 bits per charecter means with current 6-decimal-precision it moccupies 22 charecters max, equivalent to *176 bits*.
Hence, Here tried to compress Geo coordinate from base-10 to base36/62

### Base-62 Comperession
1. max 12 charectets compression from 22 charecters hence *96 bits* occupied.
2. It is **case sensitive**, hence suitable to M2M (machine-to-machine) transections.

### Base-36 Comperession
1. max 13 charectets compression from 22 charecters hence *104 bits* occupied.
2. It is **case in-sensitive**, hence suitable to H2M (Humant-to-machine) / M2H / H2H transection.

## String-Formation for Geo-Coordinate (Latitude,Longitude)
|-|8|9|.|9|9|9|9|9|9|,|-|1|7|9|.|9|9|9|9|9|9|
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|

Maximum 22 characters are required to store location (currently precision is upto 6 decimals for general public mpas)

|Place Holder|What it denotes?|
|:---:|:---|
|1|Sign for Latitude|
|2-3 & 5-10|Digits for Latitude|
|4 |Floating Point for Latitude|
|11|Seprator b/w Latitude & Longitude|
|12|Sign for Longitude|
|13-15 & 17-22|Digits for Longitude|
|16|Floating Point for Longitude|

# Separator-Index
Seprator index denotes where is seprator situated after removal of Floating point & Signs.
It means its value = No of Latitude  Digits - 1

for example,

|	Coordinates	|	Separator-Index	|
|	:---:	|	:---:	|
|	0,175.2	|	0	|
|	-89.999999,175.2	|	7	|

# ± Sign 
Sign defines that from which octant, the cordinate belongs to.
its index value ranges from 0 to 3.

|	Sign	|	Sign-Index	|
|	:---:	|	:---:	|
|	+latitude, +longitude	|	0	|
|	+latitude, -longitude	|	1	|
|	-latitude, +longitude	|	2	|
|	-latitude, -longitude	|	3	|

# Decimal-Index for Folating Points
Floating Points may be in Latitude & Longitude both.

### Floating Point in Latitude

|Latitude|Place-Index(lat)|
|:---:|:---:|
|0|0|
|89.9|1|

### Floating Point in Longitude

|Longitude|Place-Index(lon)|
|:---:|:---:|
|0|0|
|17.99|1|
|179.9|2|

### Resultant Decimal-Index Matrix

|Place-Index(lat)|Place-Index(lon)|Decimal-index|
|:---:|:---:|:---:|
|0|0|0|
|0|1|1|
|0|2|2|
|1|0|3|
|1|1|4|
|1|2|5|

# Encoding Logic

1. Defigning Sign-Index for given coordinates & then removing signs.
2. Defining Decimal-Index for coordinates received thru step-1 & then removing floating points.
3. Defining Seprator-Index for coordinates received thru step-2 & then removing seprator.
4. Encoding big number received thru step-3 for Base-36/62.
5. Concatanating Sign-Index & Deciimal-Index, then encoding them to Base-36/62.
6. Concatanating followings in sequence :
    * Encoded number received thru step-4
    * Sperator index received thru step-3
    * Encoded Charecter received thru step-5 

# Further development

1. Currently, Seprator-Index is not encoded because its max value is considered 7, but if decimals digits in Lat increases, it can be encoded
2. Encoding-Decoding functions are developed for client side in Javascript. which can be made for server side languages as well as device side platforms (like android)

# Special Thanks

For handling bignumbers in javascript, I gone thru various libraries & their performance test result. Finally came accors [@MikeMcl](https://github.com/MikeMcl)'s [bignumber.js](https://github.com/MikeMcl/bignumber.js) library which I found best according to performance & usability.

