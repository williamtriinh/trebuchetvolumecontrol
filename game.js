/// Module Aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Composite = Matter.Composite,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Vector = Matter.Vector,
    Runner = Matter.Runner,
    Constraint = Matter.Constraint;


/// Create engine and render.
var engine = Engine.create();

var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight-4,
        background: "#000",
        wireframes: false,
        showVelocity: false,
    }
});

imgNumber1 = new Image(); imgNumber1.src = "assets/numbers_1.png";
imgNumber2 = new Image(); imgNumber2.src = "assets/numbers_2.png";
imgNumber3 = new Image(); imgNumber3.src = "assets/numbers_3.png";
imgNumber4 = new Image(); imgNumber4.src = "assets/numbers_4.png";
imgNumber5 = new Image(); imgNumber5.src = "assets/numbers_5.png";
imgNumber6 = new Image(); imgNumber6.src = "assets/numbers_6.png";
imgNumber7 = new Image(); imgNumber7.src = "assets/numbers_7.png";
imgNumber8 = new Image(); imgNumber8.src = "assets/numbers_8.png";
imgNumber9 = new Image(); imgNumber9.src = "assets/numbers_9.png";
imgNumber10 = new Image(); imgNumber10.src = "assets/numbers_10.png";
var imgNumbers = [imgNumber1.src, imgNumber2.src, imgNumber3.src, imgNumber4.src, imgNumber5.src, imgNumber6.src, imgNumber7.src, imgNumber8.src, imgNumber9.src, imgNumber10.src];

var solidCategory = 0x0001;
var numberCategory = 0x0002;

var volume = 0;

/// View object.
var View = {
    /// Center of the start.
    x: render.options.width/2,
    y: render.options.height/2,
    diffX: 0,
    diffY: 0,
    followBoulder: true,
}

/// Create Objects.
var ground = Bodies.rectangle(5000, render.options.height-25, 10000, 50, {
    isStatic: true,
    render: {
        fillStyle: "yellow",
        strokeStyle: "yellow",
    },
});

/// The place for the boulder to land.
var stoppers = [];
for (var i=0; i<11; i++) {
    var xOffset = 1000;
    stoppers.push(Bodies.rectangle( xOffset+200*i, render.options.height-128, 16, 200, {
        isStatic: true,
        render: {
            fillStyle: "yellow",
            strokeStyle: "yellow",
        }
    }));
}

/// Numbers
var numbers = [];
for (var i=0; i<10; i++) {
    var xOffset = 1100;
    numbers.push(Bodies.rectangle(xOffset+200*i, render.options.height-128, 170, 64, {
        isStatic: true,
        render: {
            sprite: {
                texture: imgNumbers[i],
            }
        },
        collisionFilter: {
            mask: 0x0002,
        }
    }));
}

/// Boulder objects.
var boulderHasCollided = false;
var boulder = Bodies.circle(16, render.options.height-128, 16, {
    //density: 35,
    render: {
        fillStyle: "pink",
        strokeStyle: "pink",
    },
});

/// Trebuchet objects
var trebuchetXOffset = 32;
var trebuchetYOffset = 20;

var trebuchetBeam = Bodies.rectangle(trebuchetXOffset+135, trebuchetYOffset+render.options.height-250, 270, 20, {
    isStatic: false,
    render: {
        fillStyle: "brown",
        strokeStyle: "brown",
    },
    //mass: 10,
});

var trebuchetCounterWeight = Bodies.rectangle(trebuchetXOffset+280, trebuchetYOffset+render.options.height-160, 64, 64, {
    isStatic: false,
    render: {
        fillStyle: "brown",
        strokeStyle: "brown",
    },
});

var trebuchetFrameLeft = Bodies.rectangle(trebuchetXOffset+150, trebuchetYOffset+render.options.height-190, 250, 20, {
    isStatic: true,
    render: {
        fillStyle: "brown",
        strokeStyle: "brown",
    },
    collisionFilter: {
        mask: 0x0002,
    },
    angle: -60 * Math.PI/180,
});

var trebuchetFrameRight = Bodies.rectangle(trebuchetXOffset+218, trebuchetYOffset+render.options.height-190, 250, 20, {
    isStatic: true,
    render: {
        fillStyle: "brown",
        strokeStyle: "brown",
    },
    collisionFilter: {
        mask: 0x0002,
    },
    angle: 60 * Math.PI/180,
});

var trebuchetFrameBottom = Bodies.rectangle(trebuchetXOffset+180, trebuchetYOffset+render.options.height-80, 300, 20, {
    isStatic: true,
    render: {
        fillStyle: "brown",
        strokeStyle: "brown",
    },
    collisionFilter: {
        mask: 0x0002,
    }
});

var trebuchetConstraintBeamToFrameLeft = Constraint.create({
    bodyA: trebuchetBeam,
    pointA: {x:50, y:0},
    bodyB: trebuchetFrameLeft,
    pointB: {x:35, y:-60},      /// trebuchetBeam and trebuchetFrameLeft position difference.
    length: 0,
    stiffness: 1,
});

//console.log(trebuchetBeam.position);
//console.log(trebuchetFrameLeft.position);

var trebuchetConstraintBeamToCounterWeight = Constraint.create({
    bodyA: trebuchetBeam,
    pointA: {x:130, y:0},
    bodyB: trebuchetCounterWeight,
    pointB: {x:0, y:-20},
    length: 30,
    stiffness: 0.1,
});

var trebuchetConstraintBeamToFrameBottom = Constraint.create({
    bodyA: trebuchetBeam,
    pointA: {x:-130, y:0},
    bodyB: trebuchetFrameBottom,
    pointB: {x:-120, y:0},
    stiffness: 0.1,
    length: 1,
});

var trebuchetConstraintBoulderToBeam = Constraint.create({
    bodyA: boulder,
    pointA: {x:0, y:0},
    bodyB: trebuchetBeam,
    pointB: {x:-135, y:0},
    stiffness: 0.1,
    length: 50,
});
/// End of trebuchet

/// Keyboard event.
window.onkeyup = function(ev) {
    switch (ev.keyCode) {
        case 32: /// s
            Composite.remove(composite, trebuchetConstraintBeamToFrameBottom);
            Body.setVelocity(trebuchetCounterWeight, {x:0, y:parseInt(document.querySelector("input").value)});
            break;
        case 82: /// r
            restart();
            
    }
}

/// Add objects to composite.
var composite = Composite.create();
Composite.add(composite, [
    ground,
    boulder,
    trebuchetBeam,
    trebuchetFrameLeft,
    trebuchetFrameRight,
    trebuchetFrameBottom,
    trebuchetCounterWeight,
    trebuchetConstraintBeamToFrameLeft,
    trebuchetConstraintBeamToCounterWeight,
    trebuchetConstraintBeamToFrameBottom,
    trebuchetConstraintBoulderToBeam,
]);

stoppers.forEach(function (el){
    Composite.add(composite, el);
});
numbers.forEach(function (el){
    Composite.add(composite, el);
});

/// Add composite to world.
World.add(engine.world, [composite]);

/// function to reset the boulder and stuff.
function restart() {
    //View.followBoulder = false;
    boulderHasCollided = false;

    Composite.remove(composite, boulder);
    Composite.remove(composite, trebuchetBeam);
    Composite.remove(composite, [
        trebuchetFrameLeft,
        trebuchetFrameRight,
        trebuchetFrameBottom,
    ]);
    Composite.remove(composite, trebuchetCounterWeight);
    Composite.remove(composite, trebuchetConstraintBeamToCounterWeight);
    Composite.remove(composite, trebuchetConstraintBoulderToBeam);
    Composite.remove(composite, trebuchetConstraintBeamToFrameBottom);
    Composite.remove(composite, trebuchetConstraintBeamToFrameLeft);
    
    /// reset the view area to normal. (Took me more than an hour to solve this).
    Composite.translate(composite, {x:(ground.position.x-5000) * -1, y:(ground.position.y-render.options.height-25) * -1});

    boulder = Bodies.circle(16, render.options.height-128, 16, {
        //density: 35,
        render: {
            fillStyle: "pink",
            strokeStyle: "pink",
        },
    });

    /// Boulder objects.
    boulder = Bodies.circle(16, render.options.height-128, 16, {
        //density: 35,
        render: {
            fillStyle: "pink",
            strokeStyle: "pink",
        },
    });

    //trebuchetXOffset
    trebuchetYOffset = 70;

    /// Trebuchet objects
    trebuchetBeam = Bodies.rectangle(trebuchetXOffset+135, trebuchetYOffset+render.options.height-250, 270, 20, {
        isStatic: false,
        render: {
            fillStyle: "brown",
            strokeStyle: "brown",
        },
        //mass: 10,
    });

    trebuchetCounterWeight = Bodies.rectangle(trebuchetXOffset+280, trebuchetYOffset+render.options.height-160, 64, 64, {
        isStatic: false,
        render: {
            fillStyle: "brown",
            strokeStyle: "brown",
        },
    });

    trebuchetFrameLeft = Bodies.rectangle(trebuchetXOffset+150, trebuchetYOffset+render.options.height-190, 250, 20, {
        isStatic: true,
        render: {
            fillStyle: "brown",
            strokeStyle: "brown",
        },
        collisionFilter: {
            mask: 0x0002,
        },
        angle: -60 * Math.PI/180,
    });

    trebuchetFrameRight = Bodies.rectangle(trebuchetXOffset+218, trebuchetYOffset+render.options.height-190, 250, 20, {
        isStatic: true,
        render: {
            fillStyle: "brown",
            strokeStyle: "brown",
        },
        collisionFilter: {
            mask: 0x0002,
        },
        angle: 60 * Math.PI/180,
    });

    trebuchetFrameBottom = Bodies.rectangle(trebuchetXOffset+180, trebuchetYOffset+render.options.height-80, 300, 20, {
        isStatic: true,
        render: {
            fillStyle: "brown",
            strokeStyle: "brown",
        },
        collisionFilter: {
            mask: 0x0002,
        }
    });

    trebuchetConstraintBeamToFrameLeft = Constraint.create({
        bodyA: trebuchetBeam,
        pointA: {x:50, y:0},
        bodyB: trebuchetFrameLeft,
        pointB: {x:35, y:-60},      /// trebuchetBeam and trebuchetFrameLeft position difference.
        length: 0,
        stiffness: 1,
    });

    //console.log(trebuchetBeam.position);
    //console.log(trebuchetFrameLeft.position);

    trebuchetConstraintBeamToCounterWeight = Constraint.create({
        bodyA: trebuchetBeam,
        pointA: {x:130, y:0},
        bodyB: trebuchetCounterWeight,
        pointB: {x:0, y:-20},
        length: 30,
        stiffness: 0.1,
    });

    trebuchetConstraintBeamToFrameBottom = Constraint.create({
        bodyA: trebuchetBeam,
        pointA: {x:-130, y:0},
        bodyB: trebuchetFrameBottom,
        pointB: {x:-120, y:0},
        stiffness: 0.1,
        length: 1,
    });

    trebuchetConstraintBoulderToBeam = Constraint.create({
        bodyA: boulder,
        pointA: {x:0, y:0},
        bodyB: trebuchetBeam,
        pointB: {x:-135, y:0},
        stiffness: 0.1,
        length: 50,
    });
    

    Composite.add(composite, [
        boulder,
        trebuchetBeam,
        trebuchetFrameLeft,
        trebuchetFrameRight,
        trebuchetFrameBottom,
        trebuchetCounterWeight,
        trebuchetConstraintBeamToFrameLeft,
        trebuchetConstraintBeamToCounterWeight,
        trebuchetConstraintBeamToFrameBottom,
        trebuchetConstraintBoulderToBeam,
    ]);

    //World.remove(engine.world, [composite]);
    //World.add(engine.world, [composite]);
    console.log("reset");
}

(function run(){
    window.requestAnimationFrame(run);

    /// Update the view's position so the ball is center with the view.
    if (boulder !== undefined) {
        View.x = render.options.width/2 - boulder.position.x;
        View.y = render.options.height/2 - boulder.position.y;
    }

    /// Move the composites relative to the views position.
    if (View.followBoulder) Composite.translate(composite, {x:View.x, y:View.y});

    if (boulder.position.x >= trebuchetBeam.position.x-40) {
        Composite.remove(composite, trebuchetConstraintBoulderToBeam);
        View.followBoulder = true;
    }

    /// Collision for boulder.
    if (!boulderHasCollided) {
        for (let i=0; i<numbers.length; i++){
            /// 16 = boulder's radius.
            var num = numbers[i];
            if (boulder.position.x > num.vertices[0].x && boulder.position.x < num.vertices[2].x &&
                boulder.position.y > num.vertices[0].y && boulder.position.y < num.vertices[2].y) {
                boulderHasCollided = true;
                switch(i) {
                    case 0: volume = 10; break;
                    case 1: volume = 20; break;
                    case 2: volume = 30; break;
                    case 3: volume = 40; break;
                    case 4: volume = 50; break;
                    case 5: volume = 60; break;
                    case 6: volume = 70; break;
                    case 7: volume = 80; break;
                    case 8: volume = 90; break;
                    case 9: volume = 100; break;
                }
                document.getElementById("volume").querySelector("h1").innerHTML = "Volume : " + volume + "%";
            }           
        }
    }
    Engine.update(engine, 1000/60);
})();

Render.run(render);
