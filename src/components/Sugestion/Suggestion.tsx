import React, { useState } from "react";
import { Card, Row, Col, Typography, Modal, Tag, Button } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import "./Suggestion.css";
import image1 from "@/assets/1月.jpg";
import image2 from "@/assets/3月.png";
import image3 from "@/assets/3.3月.jpg";
import image4 from "@/assets/5月.jpg";
import image5 from "@/assets/5月.jpg";
import image6 from "@/assets/6月.jpg";
import image7 from "@/assets/7月.jpg";
import image8 from "@/assets/8月.jpg";
const { Title, Text, Paragraph } = Typography;

// 模拟建议数据 - 12个项目，刚好3x4布局
// 重新生成的suggestionData，基于农作物管理表格信息
const suggestionData = [
  {
    id: 1,
    title: "防冻保暖",
    description: "注意树干冻伤，采取必要防冻措施",
    longDescription:
      "当前温度已降至0℃以下，果树处于休眠期，树干易发生冻害。建议对树干进行包裹保护，可使用草绳或专用防寒布缠绕主干及主枝，形成保温层。同时，可在树盘覆盖稻草或地膜，减少地温骤降。清晨可向树干喷水，利用结冰释放热量保护树体。",
    imgUrl: image1,
    category: "温度",
  },
  {
    id: 2,
    title: "春季灌溉",
    description: "注意春季干旱，适时进行灌溉",
    longDescription:
      "目前土壤相对湿度低于30%，果园处于春旱状态。建议每亩浇灌40方水，以湿润土壤表层20-30cm为宜。采用沟灌、滴灌或喷灌均可，但需避免正午高温时段灌溉。2-3月份应特别注意浇好萌芽水，以促进芽眼饱满、均匀萌发，增强树势。",
    imgUrl: image2,
    category: "湿度",
  },
  {
    id: 3,
    title: "春季施肥",
    description: "进行春季追肥，促进开花结果",
    longDescription:
      "3月份应进行春季追肥，每亩推荐施用尿素10-15公斤，硫酸钾20公斤，过磷酸钙15-20公斤，配合株施微肥1.5-2.5公斤。施肥应在雨前或灌水前进行，避免肥料直接接触树干和根系。推荐采用沟施或穴施方式，沟深15-20cm，施后覆土。",
    imgUrl: image3,
    category: "施肥",
  },
  {
    id: 4,
    title: "花期管理",
    description: "花期温度管理，预防低温冻害",
    longDescription:
      "目前处于开花期，温度低于-2℃会导致花器冻害。建议采取喷施防冻剂、搭建防寒棚、安装风机等措施预防低温。同时，若温度超过26℃，应加强通风降温，可采用喷雾或搭遮阳网降温。保持花期土壤湿润但不积水，有利于坐果。",
    imgUrl: image4,
    category: "温度",
  },
  {
    id: 5,
    title: "幼果管理",
    description: "做好幼果期管理，促进果实生长",
    longDescription:
      "5月份幼果发育期，温度应保持在15-26℃之间，过高过低均影响果实发育。当土壤湿度低于30%时应及时灌溉，保持土壤湿润。同时，对果树进行色素监测，结果低于30时应及时补充中微量元素肥料，特别是锌、硼等元素，促进果实健康发育。",
    imgUrl: image5,
    category: "果实",
  },
  {
    id: 6,
    title: "水肥一体化",
    description: "推荐采用水肥一体化设施进行施肥",
    longDescription:
      "5月份应进行水肥一体化施肥，每株施用水溶性磷肥0.5-1公斤。水肥一体化技术可提高肥料利用率，减少肥料流失，降低劳动强度。施肥时应根据土壤湿度和树体长势决定施肥量，避免盲目施肥。建议选择晴天上午进行，提高肥效。",
    imgUrl: image6,
    category: "施肥",
  },
  {
    id: 7,
    title: "果实膨大期管理",
    description: "果实膨大期灌溉与施肥",
    longDescription:
      "6月上旬为果实膨大关键期，建议采用滴灌技术，每亩用水量控制在3-5方。同时追施果实膨大肥，株施硫酸钾1-2公斤或冲施聚离子钾，亩施20公斤。保持中等湿度，不宜过湿或过干。注意观察果实生长情况，如发现膨大不良，可适当增加钾肥用量。",
    imgUrl: image7,
    category: "灌溉",
  },
  {
    id: 8,
    title: "高温防护",
    description: "夏季高温期防护措施",
    longDescription:
      "7-8月气温可能超过35℃，果树生长受到抑制，需采取防护措施。建议在果园行间覆盖反光膜降温，增加灌水频次但减少单次水量，清晨或傍晚喷施叶面肥和有机硅助剂增强抗逆性。必要时搭建遮阳网，遮阳率控制在30%左右，适当修剪过密枝叶改善通风条件。",
    imgUrl: image8,
    category: "温度",
  },
  {
    id: 9,
    title: "秋梢管理",
    description: "秋梢生长与停长管理",
    longDescription:
      "8-9月为秋梢生长期，应适当控制氮肥用量，增加钾肥比例，促进秋梢充分木质化。秋梢停长后应整形修剪，去除细弱、病虫枝，保留充实枝条。同时应注意监测色素含量，结果低于30时补充叶面肥，尤其是含锌、硼、钼的微量元素肥料，提高树体抗性。",
    imgUrl: image8,
    category: "生长",
  },
  {
    id: 10,
    title: "基肥施用",
    description: "秋冬季节基肥施用指南",
    longDescription:
      "9月底至10月初是施基肥的关键时期。每亩施用腐熟农家肥6000-8000公斤，同时根据树龄和产量加入尿素35-50公斤，过磷酸钙40-50公斤，硫酸钾7-10公斤以及中微量元素肥料40-50公斤。采用环状沟施，沟深30-40cm，施后及时覆土并灌水，促进肥料分解。",
    imgUrl: image1,
    category: "施肥",
  },
  {
    id: 11,
    title: "果实着色期管理",
    description: "促进果实着色与品质提升",
    longDescription:
      "果实着色期应控制氮肥，增施钾肥和磷肥，提高果实品质。可在着色前7-10天喷施磷酸二氢钾0.3%溶液，促进糖分积累和色素形成。夜间温差大时果实着色效果更好，可适当控水增加昼夜温差。采收前停止灌溉7-10天，有助于提高果实糖度。",
    imgUrl: image2,
    category: "果实",
  },
  {
    id: 12,
    title: "封冻水管理",
    description: "冬季封冻水灌溉技术",
    longDescription:
      "11月底至12月初应浇封冻水，每亩约需40方。封冻水可保护根系免受冻害，提高土壤蓄水能力，为来年春季萌发提供水分保障。灌水深度应达到60-80cm，确保根系层完全湿润。灌溉后可在树盘覆盖秸秆或地膜保温保湿，减少水分蒸发和地温波动。",
    imgUrl: image3,
    category: "灌溉",
  },
];

const Suggestion: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    (typeof suggestionData)[0] | null
  >(null);

  const showModal = (item: (typeof suggestionData)[0]) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  return (
    <div className="suggestion-container">
      <Title level={4} className="suggestion-title">
        种植管理建议
      </Title>
      <div className="suggestion-grid">
        <Row gutter={[8, 8]}>
          {suggestionData.map((item) => (
            <Col span={8} key={item.id}>
              <Card
                hoverable
                className="suggestion-grid-card"
                cover={
                  <div className="suggestion-img-container">
                    <img
                      alt={item.title}
                      src={item.imgUrl}
                      className="suggestion-img"
                    />
                    {/* <span className="suggestion-category">{item.category}</span> */}
                  </div>
                }
                onClick={() => showModal(item)}
              >
                <Card.Meta
                  title={item.title}
                  description={
                    <div className="suggestion-brief">
                      <Text type="secondary" ellipsis>
                        {item.description}
                      </Text>
                      <Button
                        type="link"
                        size="small"
                        className="suggestion-more"
                      >
                        <InfoCircleOutlined /> 详情
                      </Button>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 详情弹窗 */}
      <Modal
        title={
          selectedItem && (
            <div className="suggestion-modal-title">
              <span>{selectedItem.title}</span>
              <Tag color="blue">{selectedItem.category}</Tag>
            </div>
          )
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        {selectedItem && (
          <div className="suggestion-modal-content">
            <div className="suggestion-modal-img-container">
              <img
                src={selectedItem.imgUrl}
                alt={selectedItem.title}
                className="suggestion-modal-img"
              />
            </div>
            <div className="suggestion-modal-description">
              <Title level={5}>简要建议:</Title>
              <Paragraph>{selectedItem.description}</Paragraph>

              <Title level={5}>详细说明:</Title>
              <Paragraph>{selectedItem.longDescription}</Paragraph>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Suggestion;
