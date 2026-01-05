import prisma from "~/configs/mysqlPrisma.config";
import HttpStatus from "~/utlis/statusMap";
import { ColorCreateData, ColorUpdateData } from "~/types/ColorDTO";

async function createColor(name: string, hex?: string) {
  try {
    const color = await prisma.color.create({
      data: {
        name,
        hex: hex || "",
      },
    });

    return {
      success: true,
      message: "Create color successfully",
      colorName: color.name,
      colorID: color.id,
      colorHex: color.hex,
      httpStatus: HttpStatus.CREATED,
    };
  } catch (e) {
    console.error(">>> Create color error:", e);
    return {
      success: false,
      message: "Create color failed",
      httpStatus: HttpStatus.BAD_REQUEST,
    };
  }
}

async function getAllColors() {
  try {
    const colors = await prisma.color.findMany();
    return {
      success: true,
      message: "Get all colors successfully",
      httpStatus: HttpStatus.OK,
      data: colors,
    };
  } catch (e) {
    console.error(">>> Get colors error:", e);
    return {
      success: false,
      message: "Get colors failed",
      httpStatus: HttpStatus.INTERNAL,
    };
  }
}

async function getColorByID(id: number) {
  try {
    const color = await prisma.color.findUnique({
      where: { id },
    });

    if (color) {
      return {
        success: true,
        message: "Get color successfully",
        httpStatus: HttpStatus.OK,
        data: color,
      };
    }

    return {
      success: true,
      message: "Color not found",
      httpStatus: HttpStatus.OK,
    };
  } catch (e) {
    console.error(">>> Get color by ID error:", e);
    return {
      success: false,
      message: "Get color failed",
      httpStatus: HttpStatus.INTERNAL,
    };
  }
}

async function updateColorByID(id: number, name: string, hex?: string) {
  try {
    const existingColor = await prisma.color.findUnique({
      where: { id },
    });

    if (!existingColor) {
      return {
        success: false,
        message: "Color not found",
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }

    const updatedColor = await prisma.color.update({
      where: { id },
      data: {
        name,
        hex: hex || existingColor.hex,
      },
    });

    return {
      success: true,
      message: "Color updated successfully",
      httpStatus: HttpStatus.OK,
      data: updatedColor,
    };
  } catch (e) {
    console.error(">>> Update color error:", e);
    return {
      success: false,
      message: "Update color failed",
      httpStatus: HttpStatus.INTERNAL,
    };
  }
}

async function deleteColorByID(id: number) {
  try {
    const existingColor = await prisma.color.findUnique({
      where: { id },
    });

    if (!existingColor) {
      return {
        success: false,
        message: "Color not found",
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }

    await prisma.color.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Color deleted successfully",
      httpStatus: HttpStatus.OK,
    };
  } catch (e) {
    console.error(">>> Delete color error:", e);
    return {
      success: false,
      message: "Delete color failed",
      httpStatus: HttpStatus.INTERNAL,
    };
  }
}

export { createColor, getAllColors, getColorByID, updateColorByID, deleteColorByID };
