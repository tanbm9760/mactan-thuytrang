import { config } from '../config'

/**
 * Link bản đồ. Nếu config.venue để trống mapUrl / mapEmbedUrl thì tự suy ra từ
 * `venue.address`, nhờ vậy đổi địa chỉ một chỗ là bản đồ đổi theo — không còn
 * cảnh sửa địa chỉ xong bản đồ vẫn chỉ về nhà hàng cũ.
 */
const query = encodeURIComponent(
  [config.venue.name, config.venue.subName, config.venue.address].filter(Boolean).join(', '),
)

export const mapUrl =
  config.venue.mapUrl?.trim() || `https://www.google.com/maps/search/?api=1&query=${query}`

export const mapEmbedUrl =
  config.venue.mapEmbedUrl?.trim() || `https://www.google.com/maps?q=${query}&output=embed`
