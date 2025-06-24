# gd-place-2024-data

History data from GD Place 2024. It contains info every placed and deleted object, including the username of who placed the object. See below for technical details, and how to read the data.

## Details

The total width and heigh of the level is 800 blocks. It is divided into 20 by 20 block chunks.

### Types

The whole history data object follows the type below:

```typescript
type Action = {
  objKey: string;
  username: string;
  time: number; // UTC timestamp in milliseconds.
};

type PlacedObject = Action & {
  object: string; // Base-126 encoded binary data represeting object data. See next section on how to decode.
};

type DeletedObject = Action & {
  chunk: string; // A string `x,y` representing the chunk the object was placed in.
}

type HistoryData = PlacedObject | DeletedObject;
```

The decoded objects have the following types:

```typescript
type GDColor = {
    r: number;
    g: number;
    b: number;
    opacity: number;
    blending: boolean;
};

type GDObjectOpt = {
    id: number;
    x: number;
    y: number;
    x_scale_exp: number;
    x_angle: number;
    y_scale_exp: number;
    y_angle: number;
    z_layer: number;
    z_order: number;
    main_color: GDColor;
    detail_color: GDColor;
}

type GDObject = {
    id: number;
    x: number;
    y: number;
    ix: number;
    iy: number;
    jx: number;
    jy: number;
    z_layer: number;
    z_order: number;
    main_color: GDColor;
    detail_color: GDColor;
}
```

To keep the size objects down, and to speed up their encoding and decoding, we chose to use an optimised binary format for the object data, which we then encoded with a custom base-encoding to prevent invalid characters from being inserted into the database. Below documents how to decode, read, and unoptimise these objects.

### Decoding

The first step to extract the object data is to decode the data from the custom base-encoding. We used base 126 because we wanted a more efficient encoding than something like base 64, but were limited to the characters allowed inside Firebase. The code for decoding is contained within `decode.ts`, and an example usage is below:

```typescript
const decodedBytes = decodeString("hv5B+25&b.ygi#5N[ 	/F", 126);
```

### Reading

Once decoded, you will have an array of 8 bit integers representing the object data. This now needs to be read in the correct order back into the object data. The code to do so is provided in `read.ts`, and an example usage is below:

```typescript
const gdObjectOpt = readObject(decodedBytes);
```

However, within the rust code, this is the optimised version of the original object, which is marginally smaller, but harder to use. To convert from the optimised object to the original object, which represents warping in a more sensible manner, you can use the function `objectFromOptimised` within `object.ts`, like below:

```typescript
const originalObject = objectFromOptimised(gdOjectOpt);

/*
console.log(originalObject)

{
  "id": 1601,
  "x": 3019,
  "y": 1427,
  "ix": -0.9659258262890682,
  "iy": 0.258819045102521,
  "jx": -0.25881904510252063,
  "jy": -0.9659258262890683,
  "z_layer": 3,
  "z_order": 0,
  "main_color": {
    "r": 255,
    "g": 255,
    "b": 255,
    "opacity": 255,
    "blending": false
  },
  "detail_color": {
    "r": 255,
    "g": 255,
    "b": 255,
    "opacity": 255,
    "blending": false
  }
}
*/
```

You may observe some floating point inaccuracies in the data, in which case we would recommend just rounding the numbers. 