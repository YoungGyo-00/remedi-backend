# <img src="https://github.com/YoungGyo-00/remedi-backend/assets/89639470/41afa1d0-5877-4123-9472-4ab7d3f03c46" align="left" width="100"></a> **REMEDi**
**서류 발급 필요 없는 보험금 청구 자동화 서비스**
<br/>

REMEDi는 서류 발급과 보험금 청구 과정을 생략하여 환자에게 편리함을 제공하는 프로젝트이다.<br/>
[HL7 국제 의료 메세지 표준](https://hl7-definition.caristix.com/v2/HL7v2.7/TriggerEvents/EHC_E01)을 적용하여 보험금 청구를 자동화하는 Pub/Sub 분산 환경 프로세스를 가정했다.

<br/>

# Why REMEDi?
## 보험금 청구 자동화
![img](https://user-images.githubusercontent.com/89639470/208136362-99d9940c-dc64-4525-b14e-2854ab36d163.png)

아래와 같은 문제들을 자동화하는 분산 시스템을 가정하는 프로젝트를 설계 및 구현하였다.
1. 병원에서만 구입 가능한 MD(Medical Device) 제품에 실손의료보험이 적용되는 사실을 모르는 환자들이 많은 문제<br/>
2. 환급 받기 위해 병원에 직접 방문하는 등 번거로운 문제 -> 보험금 미청구 건수 51.4%

<br/>

# Work Flow
## 병원 EMR 부분(Publisher)

EMR의 기본 흐름은 다음과 같다.
1. 등록(Register) -> 접수(Receipt) -> 진료(Diagnosis) -> 수납(Fee)의 과정이다.<br/>
2. 수납(Fee)이 완료됨과 동시에, 클라우드 기반 EMR에 의무적으로 기록이 저장되는 흐름을 가정하였다.<br/>
3. 이를 HL7 국제 의료 메시지 표준에 따라 Message를 생성하고 KafKa를 통해 Publish 하도록 설계하였다.

![img](https://user-images.githubusercontent.com/89639470/208124967-0273fe33-47f8-43bc-9aa1-3dc28698fa04.png)

## 보험사 부분(Subscriber)

보험금 청구에 필요한 정보의 기본 흐름은 다음과 같다.
1. HL7 Message 형태로 Publish, Apache NiFi에서 Subscribe하는 과정을 볼 수 있다.<br/>
2. 수신된 HL7 Message를 정보에 따라 Parsing, 데이터베이스에 저장한다.<br/>

![img](https://user-images.githubusercontent.com/89639470/208132648-ba6d6769-d47d-4a92-b78e-b7d5a7a08308.png)

<br/>

# Service UI
## 접속 화면 (홈)
![emr_home](https://user-images.githubusercontent.com/102170253/207537231-498200df-b95a-4f9d-9679-7e08e5d2dde3.png)

## 원무(원무과)

-   환자의 정보를 기입하여 신규환자 등록한다.
-   환자의 보험정보, 접수정보, 바이탈 싸인을 기입하여 접수를 완료한다.

|                                                           신환 등록                                                            |                                                          환자 접수                                                           |
| :----------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|                                           신환 등록하기 → 환자 정보 작성 → 환자 등록                                           |                                         환자 이름 검색 → 접수 정보 기입 → 환자 접수                                          |
| ![administration_home](https://user-images.githubusercontent.com/102170253/207537274-3f4a3b1b-ea71-49e8-a6bc-3697c5878989.png) | ![searching_patient](https://user-images.githubusercontent.com/102170253/207537271-bd6adbab-27bc-485d-93cf-450d834a0141.png) |
|    ![register_new](https://user-images.githubusercontent.com/102170253/207537268-eaab742b-ada8-45ac-9bd6-85015767dcdb.png)     |     ![reception](https://user-images.githubusercontent.com/102170253/207537263-4ba78a0a-90b7-46c7-a33c-7c1b9a8ea477.png)     |

## 진료(의료진)

-   진료 화면의 오른쪽 MD 리스트에서 항목을 클릭하여 MD를 처방한다.
-   진료 화면의 왼쪽 내원이력을 클릭하여 환자의 이전 내원이력을 확인할 수 있다.
-   진료 홈에서 새로운 MD를 직접 등록할 수 있다.

|                                                                                                                              진료                                                                                                                              |                                                                                                                      MD 등록                                                                                                                      |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                                                           진료 시작하기 → 진료 차트 작성 → 진료 완료                                                                                                           |                                                                                                               제품 정보 입력 → 등록                                                                                                               |
| ![KakaoTalk_20221216_165131627](https://user-images.githubusercontent.com/102170253/208052816-141f1a7f-162d-4421-bc2d-617871b9b62e.png) ![examination](https://user-images.githubusercontent.com/102170253/208051467-7a6a7f14-7a4e-4fcf-8d26-57943984d296.png) | ![md_register_1](https://user-images.githubusercontent.com/102170253/208051410-eb933cac-00e6-490d-8644-f86385987a56.png) ![md_register_2](https://user-images.githubusercontent.com/102170253/208051415-7a598cdb-c1b8-435e-80f2-3f1b3aa307b1.png) |

## 원무(원무과)

-   진료가 완료된 환자의 수납정보를 확인하고 수납을 완료한다.
-   수납이 완료된 환자의 정보는 자동적으로 HL7 Message로 변환되어, 보험사에 전송한다.

|                                                                                                                   수납                                                                                                                    |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                                                         수납 진행하기 → 수납 완료                                                                                                         |
| ![payment_1](https://user-images.githubusercontent.com/102170253/207537296-b6b6f870-a74a-4df9-864a-dc895037ee4b.png) ![payment_2](https://user-images.githubusercontent.com/102170253/207537255-3fd4c7df-089c-4da5-86cd-c4b12330fb32.png) |

<br/>

# ER-Diagram
![img](https://user-images.githubusercontent.com/89639470/208146922-cb8ddfb6-34bb-4132-a2c8-ab33c3106580.png)

<br/>

# Tech Stack
## Back-end
| <img width="130" alt="img" src="https://user-images.githubusercontent.com/89639470/208116529-71d56833-2597-4450-8927-0bf0cdf2a273.png"> | <img width="130" alt="img" src="https://user-images.githubusercontent.com/89639470/208117609-92fdf7ca-01ea-47b4-9a3c-5b1f8601e0dd.png"> | <img width="130" alt="img" src="https://user-images.githubusercontent.com/89639470/208117748-f9c61e3b-617f-4b76-a66d-39c45431bc0b.png"> | <img width="130" alt="img" src="https://user-images.githubusercontent.com/89639470/208117884-7cef4e78-d8a2-4dda-8fd8-a39ab52fa334.png"> | <img width="130" alt="img" src="https://user-images.githubusercontent.com/89639470/208117828-685b656a-d336-4175-b12c-28608798862c.png"> | <img width="130" alt="img" src="https://github.com/YoungGyo-00/remedi-backend/assets/89639470/f55107e5-3e5d-4f92-be00-ebd8bd02f61d"> |
| :---------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                      TypeScript                                                                       |                                                                                           Express                                                                                            |                                                                                           TypeORM                                                                                            |                                                                                          PostgreSQL                                                                                          |                                                                                         Apache KafKa                                                                                         |                                                                                         Apache NiFi                                                                                        |

## Infra
| <img width="130" alt="img" src="https://user-images.githubusercontent.com/89639470/208126547-9bedea0a-f56e-489d-b6fc-fa046f973904.png"> | <img width="130" alt="img" src="https://user-images.githubusercontent.com/89639470/208126554-88d412ac-3a43-4abd-8a45-207724252127.png"> | <img width="130" alt="img" src="https://github.com/YoungGyo-00/remedi-backend/assets/89639470/ff18d8e3-8088-4fd2-ae9f-d65de00ebe9b"> | 
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                                           AWS EC2                                                                                            |                                                                                           AWS RDS                                                                                            |                                                                                           Docker                                                                                            | 
---

<br/>

# Member
## Front-end

| <img src="https://avatars.githubusercontent.com/u/102170253?v=4" width="130" height="130"> | <img src ="https://avatars.githubusercontent.com/u/102405208?v=4" width="130" height="130"> | <img src ="https://avatars.githubusercontent.com/u/74121375?v=4" width="130" height="130"> | 
| :---------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------: |
|                         [박선민](https://github.com/miiiniii)                               |                         [우성주](https://github.com/seongjoow)                             |                          [이연수](https://github.com/yeonsu7777)                             |


## Back-end

| <img src="https://avatars.githubusercontent.com/u/89639470?v=4" width="130" height="130"> |  
| :---------------------------------------------------------------------------------------: | 
|                         [이영교](https://github.com/YoungGyo-00)                           |

</br>

# Appendix

-   🔍[REMEDi - Frontend Source Code Repository](https://github.com/Remedi2022/EMR_frontend)
-   🔍[Notion - HL7 EHC_E01 세그먼트](https://shade-sled-bf2.notion.site/HL7-EHC-01-01b118c9bb94412b9cc0bf05c3ebb3cc)
