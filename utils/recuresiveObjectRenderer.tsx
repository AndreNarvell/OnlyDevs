import { Text } from "../components/Text"
import { formatPrice } from "./formatPrice"
import { ReactElement } from "react"

const TEXT_SIZE = "sm"

export const recursiveObjectRenderer = (obj: object) => {
  return Object.entries(obj).map(([key, value]) => {
    let Component: ReactElement = <div />

    switch (typeof value) {
      case "string": {
        Component = (
          <Text as="p" intent="secondary" size={TEXT_SIZE}>
            {value}
          </Text>
        )
        break
      }
      case "number": {
        Component = (
          <Text as="p" intent="secondary" size={TEXT_SIZE}>
            {key.includes("price") ? formatPrice(value) : value}
          </Text>
        )
        break
      }

      case "object": {
        if (Array.isArray(value)) {
          Component = (
            <ul className="list-inside">
              {value.map(item => (
                <li
                  className="list-disc marker:content-['-'] leading-none marker:text-xs marker:text-secondary "
                  key={item}
                >
                  <Text
                    as="span"
                    display="inline"
                    intent="secondary"
                    size={TEXT_SIZE}
                  >
                    {item}
                  </Text>
                </li>
              ))}
            </ul>
          )
        }
        break
      }
    }

    return (
      <div className="mb-2" key={key}>
        <Text as="h6" intent="primary" size={TEXT_SIZE} className="capitalize">
          {key}
        </Text>

        {Component}
      </div>
    )
  })
}
