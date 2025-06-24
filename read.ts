class Reader<T extends ArrayBufferView> {
    private readonly view: DataView;
    private byteOffset: number;

    constructor(array: T, expectedSize: number) {
        if (array.byteLength != expectedSize) {
            throw new Error(`Invalid object size, got ${array.byteLength} but needs ${expectedSize}`);
        }
        this.view = new DataView(array.buffer);
        this.byteOffset = 0;
    }

    readBool(): boolean {
        return this.readU8() == 1;
    }

    readI8(): number {
        let v = this.view.getInt8(this.byteOffset);
        this.byteOffset += 1;
        return v;
    }

    readU8(): number {
        let v = this.view.getUint8(this.byteOffset);
        this.byteOffset += 1;
        return v;
    }

    readU16(): number {
        let v = this.view.getUint16(this.byteOffset, true);
        this.byteOffset += 2;
        return v;
    }

    readF32(): number {
        let v = this.view.getFloat32(this.byteOffset, true);
        this.byteOffset += 4;
        return v;
    }
}

// This represents the total size of an object struct. This will never change.
const GD_OBJECT_SIZE = 26;

const readColor = (
    reader: Reader<Uint8Array>,
): GDColor => {
    const r = reader.readU8();
    const g = reader.readU8();
    const b = reader.readU8();

    const opacity = reader.readU8();

    const blending = reader.readBool();

    return {
        r,
        g,
        b,
        opacity,
        blending,
    };
};

const readObject = (
    decodedBytes: Uint8Array
): GDObject => {
    let reader: Reader<Uint8Array> = new Reader(decodedBytes, GD_OBJECT_SIZE);

    const id = reader.readU16();

    const x = reader.readF32();
    const y = reader.readF32();

    const x_scale_exp = reader.readI8();
    const x_angle = reader.readI8();
    const y_scale_exp = reader.readI8();
    const y_angle = reader.readI8();

    const z_layer = reader.readU8();

    const z_order = reader.readI8();

    const main_color = readColor(reader);

    const detail_color = readColor(reader);

    return {
        id,
        x,
        y,
        x_scale_exp,
        x_angle,
        y_scale_exp,
        y_angle,
        z_layer,
        z_order,
        main_color,
        detail_color,
    };
};
