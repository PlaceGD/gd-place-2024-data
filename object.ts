const convertOptTransform = (
    xScaleExp: number,
    xAngle: number,
    yScaleExp: number,
    yAngle: number
): [number, number, number, number] => {
    const xScale = Math.pow(2.0, xScaleExp / 12.0);
    const xRad = (xAngle * 5.0) * (Math.PI / 180.0);

    const yScale = Math.pow(2.0, yScaleExp / 12.0);
    const yRad = (yAngle * 5.0) * (Math.PI / 180.0);

    return [
        xScale * Math.cos(xRad),
        xScale * Math.sin(xRad),
        yScale * Math.cos(yRad),
        yScale * Math.sin(yRad)
    ];
}

const objectFromOptimised = (
    optimisedObject: GDObjectOpt,
): GDObject => {
    let [ix, iy, jx, jy] = convertOptTransform(
        optimisedObject.x_scale_exp,
        optimisedObject.x_angle,
        optimisedObject.y_scale_exp,
        optimisedObject.y_angle,
    );

    return {
        id: optimisedObject.id,
        x: optimisedObject.x,
        y: optimisedObject.y,
        ix,
        iy,
        jx,
        jy,
        z_layer: optimisedObject.z_layer,
        z_order: optimisedObject.z_order,
        main_color: optimisedObject.main_color,
        detail_color: optimisedObject.detail_color,
    }
}