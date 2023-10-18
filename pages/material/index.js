import axios from "axios";
import Head from "next/head";
import CardAF from "@/components/Card/CardAF";
import CardDDL from "@/components/Card/CardDDL";
import CardDML from "@/components/Card/CardDML";
import CardDCL from "@/components/Card/CardDCL";
import CardJoin from "@/components/Card/CardJoin";
import MainLayout from "@/components/Layout/MainLayout";

export async function getServerSideProps(context) {
  const getCookies = context.req.headers.cookie;
  const token = context.req.cookies.token;
  if (!getCookies)
    return {
      redirect: {
        source: "/material",
        destination: "/login",
        permanent: true,
      },
    };
  const viewMaterial = await axios
    .get(process.env.BASE_URL + "/api/admin/view-material")
    .then((response) => response.data);
  const viewProgress = await axios
    .get(process.env.BASE_URL + "/api/user/view-progress", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
  const progressDDL = await axios
    .get(process.env.BASE_URL + "/api/user/progress/data-definition-language", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data?.viewProgress[0]?._count?.Progress);
  const progressDML = await axios
    .get(
      process.env.BASE_URL + "/api/user/progress/data-manipulation-language",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then((response) => response.data?.viewProgress[0]?._count?.Progress);
  const progressDCL = await axios
    .get(process.env.BASE_URL + "/api/user/progress/data-control-language", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data?.viewProgress[0]?._count?.Progress);
  const progressJoin = await axios
    .get(process.env.BASE_URL + "/api/user/progress/multitable-join", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data?.viewProgress[0]?._count?.Progress);
  const progressAF = await axios
    .get(process.env.BASE_URL + "/api/user/progress/aggregate-function", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data?.viewProgress[0]?._count?.Progress);
  return {
    props: {
      materials: viewMaterial,
      progress: viewProgress,
      cookies: token,
      progressDDL,
      progressDML,
      progressDCL,
      progressJoin,
      progressAF,
    },
  };
}

export default function Material({
  materials,
  progress,
  cookies,
  progressDDL,
  progressDML,
  progressDCL,
  progressJoin,
  progressAF,
}) {
  return (
    <>
      <Head>
        <title>Materi</title>
        <link rel="icon" href="icons/favicon.ico"></link>
      </Head>
      <div className="flex flex-row px-32">
        <div className="flex h-adaptive w-full items-start justify-center pt-10">
          <div className="h-[97.5%] w-full rounded-md border-2 border-gray-200 bg-white/10 p-4 backdrop-blur-sm">
            <div className="h-full space-y-2.5 overflow-scroll">
              {!materials && !progress && (
                <p className="text-center font-head text-2xl font-bold text-secondary-400">
                  Materi Belum Tersedia
                </p>
              )}
              <p className="text-center font-head text-xl font-bold text-secondary-400">
                Daftar Materi
              </p>
              {materials?.viewMaterial[0].Content?.lenth !== 0 && (
                <CardDDL
                  material={materials?.viewMaterial[0]}
                  cookies={cookies}
                />
              )}
              {materials?.viewMaterial[1]?.Content?.length !== 0 && (
                <CardDML
                  material={materials?.viewMaterial[1]}
                  cookies={cookies}
                  progressDDL={progressDDL}
                />
              )}
              {materials?.viewMaterial[2]?.Content?.length !== 0 && (
                <CardDCL
                  material={materials?.viewMaterial[2]}
                  cookies={cookies}
                  progressDDL={progressDDL}
                  progressDML={progressDML}
                />
              )}
              {materials?.viewMaterial[3]?.Content?.length !== 0 && (
                <CardJoin
                  material={materials?.viewMaterial[3]}
                  cookies={cookies}
                  progressDDL={progressDDL}
                  progressDML={progressDML}
                  progressDCL={progressDCL}
                />
              )}
              {materials?.viewMaterial[4]?.Content?.length !== 0 && (
                <CardAF
                  material={materials?.viewMaterial[4]}
                  cookies={cookies}
                  progressDDL={progressDDL}
                  progressDML={progressDML}
                  progressDCL={progressDCL}
                  progressAF={progressAF}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Material.getLayout = function getLayout(material) {
  return <MainLayout>{material}</MainLayout>;
};
