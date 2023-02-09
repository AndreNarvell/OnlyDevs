import { Text } from "../../../components/Text"
import teacher1 from "../../../public/images/teacher1.jpg"
import teacher2 from "../../../public/images/teacher2.jpg"
import teacher3 from "../../../public/images/teacher3.jpg"
import Image from "next/image"

export const TeacherCloud = () => {
  return (
    <section className="grid items-center grid-cols-2 mt-16">
      <div>
        <Text
          as="h1"
          size="3xl"
          weight="bold"
          align="center"
          className="mb-4"
          leading="snug"
        >
          Join <span className="text-success">100.000+</span> teachers and start
          earning money
        </Text>
        <Text as="p" intent="secondary" align="center" className="px-12 mb-8">
          Unleash Your Potential and Transform Lives. Sign up today to start
          creating courses and earn money.
        </Text>
      </div>

      <div className="relative w-3/4 mx-auto aspect-square">
        <div className="absolute w-full rounded-full aspect-square bg-success-dark/50 blur-3xl" />

        <div />

        <div className="absolute left-0 w-40 h-40 transition top-8 hover:scale-110">
          <Image
            title="Zahir"
            src={teacher1}
            width={300}
            height={300}
            alt="Picture of one of our teachers"
            className="absolute rounded-full blur-md"
          />
          <Image
            title="Zahir"
            src={teacher1}
            width={300}
            height={300}
            alt="Picture of one of our teachers"
            className="absolute rounded-full "
          />
        </div>

        <div className="absolute w-32 h-32 transition bottom-8 left-14 hover:scale-110">
          <Image
            title="Garry"
            src={teacher2}
            width={300}
            height={300}
            alt="Picture of one of our teachers"
            className="absolute rounded-full blur-md"
          />
          <Image
            title="Garry"
            src={teacher2}
            width={300}
            height={300}
            alt="Picture of one of our teachers"
            className="absolute rounded-full"
          />
        </div>

        <div className="absolute right-0 w-48 h-48 transition top-12 hover:scale-110">
          <Image
            title="Alina"
            src={teacher3}
            width={300}
            height={300}
            alt="Picture of one of our teachers"
            className="absolute rounded-full blur-md "
          />
          <Image
            title="Alina"
            src={teacher3}
            width={300}
            height={300}
            alt="Picture of one of our teachers"
            className="absolute rounded-full "
          />
        </div>
      </div>
    </section>
  )
}
