import Cloudian from "~/services/cloudinary.services";
function mapThumbnail(thumbnail: unknown) {
    if (!Array.isArray(thumbnail)) return [];
    return (thumbnail as string[]).map((id) => ({
        public_id: id,
        url: Cloudian.getImageUrl(id),
    }));
}
export default mapThumbnail;
