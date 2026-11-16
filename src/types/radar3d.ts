export type VisualRenderMode = 'realistic' | 'tactical' | 'history';

export interface GalleryItem {
  url: string;
  caption: string;
  tag: 'Hiện trạng di tích' | 'Tư liệu lịch sử' | 'Mô phỏng 3D' | 'Bản đồ chiến sự';
}

export interface RadarPOI {
  id: string;
  name: string;
  shortName: string;
  frenchName?: string;
  category: 'bunker' | 'stronghold' | 'hq' | 'hill' | 'valley';
  subSector: 'Phân khu Bắc' | 'Phân khu Trung tâm' | 'Phân khu Nam' | 'Đại bản doanh';
  elevation: string;
  constructionDate: string;
  forces: string;
  coordinates: { x: number; y: number; z: number }; // 3D world coords
  mapPercent: { x: number; y: number }; // 2D coords percentage
  thumbnail: string;
  panoramaImage?: string;
  isRealPanorama?: boolean;
  gallery: GalleryItem[];
  description: string;
  historicalSignificance: string;
  historicalQuote?: string;
  status1954: string;
}

export type RadarViewMode = '3d' | '2d';
export type CameraPreset = 'current' | 'overview' | 'topdown' | 'cinematic' | 'valley';

export interface TacticalLayers {
  strongholds: boolean;  // Cứ điểm / Đồn
  bunkers: boolean;      // Hầm
  hq: boolean;           // Sở chỉ huy
  attackArrows: boolean; // Hướng tấn công
  defenseLines: boolean; // Tuyến phòng thủ
  maneuverLines: boolean;// Đường cơ động
  rivers: boolean;       // Sông suối
  highTerrain: boolean;  // Địa hình cao
  valley: boolean;       // Thung lũng
  labels: boolean;       // Bật nhãn địa danh
  contourLines: boolean; // Đường đồng mức radar (tùy chọn)
}
